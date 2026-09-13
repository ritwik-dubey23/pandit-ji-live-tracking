import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";


// 1. Create and Edit controller 


// export const createEditShop = async(req, res) => { 
//     try { 
//         const { name, city, state, address } = req.body; 

//         let image; 

//         if (req.file) { 
//             image = await uploadOnCloudinary(req.file.path); 
//         } 

//         let shop = await Shop.findOne({ owner: req.userId }); 

//         if (!shop) { 

//             // Create new shop 
//             shop = await Shop.create({ 
//                 name, 
//                 city, 
//                 state, 
//                 address, 
//                 image, 
//                 owner: req.userId 
//             }); 

//         } else { 

//             // Update existing shop 
//             shop = await Shop.findByIdAndUpdate( 
//                 shop._id, { 
//                     name, 
//                     city, 
//                     state, 
//                     address, 
//                     ...(image && { image }), 
//                     owner: req.userId 
//                 }, { new: true } 
//             ); 
//         } 

//         await shop.populate("owner"); 

//         return res.status(201).json(shop); 

//     } catch (error) { 
//         return res.status(500).json({ 
//             message: `create shop(new) ERROR ${error}` 
//         }); 
//     } 
// }; 



export const createEditShop = async(req, res) => {
    try {
        const { name, city, state, address } = req.body;

        let image;

        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        let shop = await Shop.findOne({ owner: req.userId }).populate("owner items");

        if (!shop) {

            // Create new shop 
            shop = await Shop.create({
                name,
                city,
                state,
                address,
                image,
                owner: req.userId
            });

        } else {

            // Update existing shop 
            shop = await Shop.findByIdAndUpdate(
                shop._id, {
                    name,
                    city,
                    state,
                    address,
                    ...(image && { image }),
                    owner: req.userId
                }, { new: true }
            );
        }

        await shop.populate("owner  items");

        return res.status(201).json(shop);

    } catch (error) {
        return res.status(500).json({
            message: `create shop(new) ERROR ${error}`
        });
    }
};


//2.  getshoop ka DATA LANE KE LIYE FRONTEND SEE 

export const getMyShop = async(req, res) => {


    //  Shop model ka name  h 

    try {
        //poppulate krne see


        //Shop
        // ↓
        // populate("owner")↓
        // User का पूरा object

        // Shop↓
        // populate("items")↓
        // Item के पूरे objects


        const shop = await Shop.findOne({ owner: req.userId })
            .populate("owner", "-password")
            .populate({
                path: "items",
                options: { sort: { updatedAt: -1 } }
            })

        if (!shop) {
            return res.status(404).json({
                message: "Shop not found"
            });

        }

        return res.status(200).json(shop);

    } catch (error) {
        return res.status(500).json({ message: `GET my Shop Error ${error} ` })

    }
}


// SHOP ACROOODING TO CITY

export const getShopByCity = async(req, res) => {



    try {

        const { city } = req.params

        // SAHI:
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')



        if (!shops) {
            return res.status(404).json({
                message: "Shop not found"
            });

        }


        return res.status(201).json(shops);


    } catch (error) {
        return res.status(500).json({ message: `GET  Shop by City Error ${error} ` })

    }
}