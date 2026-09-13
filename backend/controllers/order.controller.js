import Shop from "../models/shop.model.js"
import Order from "../models/order.model.js"
import User from "../models/user.models.js";
import DeliveryAssignment from "../models/deliveryAssignment.model.js";


export const placeOrder = async(req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

        if (cartItems.length == 0 || !cartItems) {
            return res.status(400).json({ message: "Cart is Empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "Send Complete delivery Address" })
        }

        // ####
        //AGAR grruoItemByShop OBJECT me kuch nhi h to NEW ARray CREATE ho JYEGI AND 
        // AGAR phle se arr me h item to new wla item  arr me push ho jyegaaa



        const groupItemsByShop = {}

        cartItems.forEach(item => {
            const shopId = item.shop

            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = [];

            }
            groupItemsByShop[shopId].push(item);

        });



        // Individual shop ko bhejne ge order 


        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async(shopId) => {

            const shop = await Shop.findById(shopId).populate("owner");
            if (!shop) {

                return res.status(400).json({ message: "Shop Not found " })

            }
            const items = groupItemsByShop[shopId];

            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)

            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i.id || i._id,

                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))
            };











        }))





        const newOrder = await Order.create({

            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders

        })

        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")

        await newOrder.populate("shopOrders.shop", "name")

        return res.status(201).json(newOrder)



    } catch (error) {
        return res.status(500).json({ message: "place ORder  Error", error })

    }
}




// SARE ORDERS JO USER NE KRE H  

// export const getMyOrders = async(req, res) => {


//     const user = await User.findById(req.userId);


//     try {
//         if (user.role === "user") {

//             const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 }).populate("shopOrders.shop", "name")

//             .populate("shopOrders.owner", "name email  mobile")
//                 .populate("shopOrders.shopOrderItems.item", "name image  price")


//             return res.status(200).json(orders)

//         } else if (user.role === "owner") {
//             const orders = await Order.find({ "shopOrders": req.userId }).sort({ createdAt: -1 }).populate("shopOrders.shop", "name")

//             .populate("user")
//                 .populate("shopOrders.shopOrderItems.item", "name image  price")


//             return res.status(200).json(orders)

//         }


//     } catch (error) {
//         return res.status(500).json({ message: "fn == getUserORder  Error", error })




//     }





// }





export const getMyOrders = async(req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user.role === "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price");

            return res.status(200).json(orders);

        } else if (user.role === "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price");



            const filterOrder = orders.map((order => (

                {
                    _id: order._id,
                    paymentMethod: order.paymentMethod,
                    user: order.user,
                    shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                    createdAt: order.createdAt,

                    deliveryAddress: order.deliveryAddress
                }

            )))
            return res.status(200).json(filterOrder);
        }

    } catch (error) {
        console.log(error); // terminal me actual reason dekhne ke liye
        return res.status(500).json({ message: "fn == getUserORder Error", error });
    }
};




export const updateOrderStatus = async(req, res) => {
    try {

        const { orderId, shopId } = req.params;


        // req.body = request ke andar bheja gaya data 
        // | req.params = URL ke andar diya gaya dynamic data
        const { status } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }


        const shopOrder = order.shopOrders.find((shopOrder) => shopOrder.shop.toString() === shopId);


        if (!shopOrder) {
            return res.status(400).json({ message: "Shop Order not found" });
        }
        shopOrder.status = status;
        // await shopOrder.populate("shopOrderItems.item", "name image price");







        let deliveryBoyPayload = [];













        //GETTING DILVERy BOY FOR THE ORDER
        // if (status === "out of delivery" || !shopOrder.assignment) {

        if (status === "out of delivery" && !shopOrder.assignment) {
            const { longitude, latitude } = order.deliveryAddress;
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",

                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)]
                        },
                        $maxDistance: 5000
                    }
                }
            })

            const nearByIds = nearByDeliveryBoys.map((boy) => boy._id);
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: {
                    $nin: [
                        "broadcasted", "completed"
                    ]
                }
            }).distinct("assignedTo");

            const busyIdsSet = new Set(busyIds.map(id => String(id)));
            const availableBoys = nearByDeliveryBoys.filter((boy) => !busyIdsSet.has(String(boy._id)));
            const candidates = availableBoys.map(boy => boy._id);

            if (candidates.length === 0) {
                await order.save();
                return res.status(400).json({ message: " order Status is updated but ###  No available delivery boys" });
            }

            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                broadcastedTo: candidates,
                status: "broadcasted"
            });
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
            shopOrder.assignment = deliveryAssignment._id;

            deliveryBoyPayload = availableBoys.map(boy => ({
                id: boy._id,
                fullName: boy.fullName,
                longitude: boy.location.coordinates[0],
                latitude: boy.location.coordinates[1],
                mobile: boy.mobile
            }));
        }
        await shopOrder.save();
        await order.save();
        await order.populate("shopOrders.shop", "name");


        await order.populate("shopOrders.assignedDeliveryBoy", "fullName mobile email");

        const updatedShopOrder = order.shopOrders.find((shopOrder) =>
            String(shopOrder.shop && (shopOrder.shop._id || shopOrder.shop)) === String(shopId)
        );

        return res.status(200).json(

            {


                shopOrder: updatedShopOrder,
                assignedDeliveryBoy: updatedShopOrder.assignedDeliveryBoy,
                availableBoys: deliveryBoyPayload,
                assignment: updatedShopOrder.assignment
            }
        );

    } catch (error) {



        return res.status(500).json({ message: "  order status ERROR  fn == updateOrderStatus Error", error });

    }
}