//item ke  controller food items

import uploadOnCloudinary from "../utils/cloudinary.js";
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";







export const addItem = async(req, res) => {
    try {
        const { name, category, foodType, price } = req.body;

        let image;

        if (req.file) {

            image = await uploadOnCloudinary(req.file.path);



        }

        if (!image) {
            return res.status(400).json({ message: "Image is required..." })
        }

        const shop = await Shop.findOne({ owner: req.userId })

        if (!shop) {
            return res.status(400).json({ message: "Shop Not Found... " })
        }



        // shop mil gyi to phir item create krde    req,body se data  la ke

        const item = await Item.create({ name, category, foodType, price, image, shop: shop._id })
        shop.items.push(item._id)
        await shop.save();


        // await shop.populate("items owner");

        await shop.populate("owner")
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })






        // return res.status(201).json(item);
        return res.status(201).json(shop);

    } catch (error) {
        console.log(error);

        return res.status(500).json({ message: `add item Error ${error }` })
    }
}

// edit item ke liyyye controller 


export const editItem = async(req, res) => {


    try {
        const itemId = req.params.itemId;
        const { name, category, foodType, price } = req.body;

        let image;

        if (req.file) {

            image = await uploadOnCloudinary(req.file.path);

        }

        // update 

        const updateData = {
            name,
            category,
            foodType,
            price
        };

        if (image) {
            updateData.image = image;
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            updateData, { new: true }
        );

        if (!item) {
            return res.status(400).json({ message: "Item not Found...." })
        }


        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(200).json(shop);

    } catch (error) {
        return res.status(500).json({ message: `Edit  item Error ${error }` })

    }
}



// for  GET THE ITEM BY ITS _ID
export const getItemById = async(req, res) => {

    try {

        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(400).json({ message: "Item not Found...." })

        }

        return res.status(200).json(item);



    } catch (error) {

        return res.status(500).json({ message: `Edit item Error ${error}` })
    }
}



// // ITEM DELETE CONTROLLER 


export const deleteItem = async(req, res) => {
    try {
        const itemId = req.params.itemId

        const item = await Item.findByIdAndDelete(itemId);


        if (!item) {
            return res.status(400).json({ message: "Item not Found...." })

        }

        const shop = await Shop.findOne({ owner: req.userId })

        shop.items = shop.items.filter(i => i !== item._id)
        await shop.save();



        await shop.populate("owner")

        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })


        return res.status(200).json(shop);

    } catch (error) {
        return res.status(500).json({ message: ` fn == deleteItem Error ${error}` })

    }
}


















// items  accroding to specific Cities


export const getItemByCity = async(req, res) => {
    try {

        const { city } = req.params;


        if (!city) {
            return res.status(400).json({ message: "City is  required...." })


        }
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')



        if (!shops) {
            return res.status(404).json({
                message: "Shop not found"
            });
        }



        const shopIds = shops.map((shop) => shop._id)

        // find kr re ho wo  wle item jinki  item wle model me  updar wali shopIds me h

        const items = await Item.find({ shop: { $in: shopIds } })

        return res.status(200).json(items);





    } catch (error) {
        return res.status(500).json({ message: ` fn == getItemByCity  in   item.controller  ${error}` })

    }


}



































// // ITEM DELETE CONTROLLER 


// export const deleteItem = async(req, res) => {
//     try {
//         const itemId = req.params.itemId

//         const item = await Item.findByIdAndDelete(itemId);


//         if (!item) {
//             return res.status(400).json({ message: "Item not Found...." })

//         }

//         const shop = await Shop.findOne({ owner: req.userId })

//         shop.items = shop.items.filter(
//             i => i.toString() !== item._id.toString()
//         )

//         await shop.save();


//         await shop.populate("owner")

//         await shop.populate({
//             path: "items",
//             options: { sort: { updatedAt: -1 } }
//         })


//         return res.status(200).json(shop);

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: ` fn == deleteItem Error ${error}` })

//     }
// }