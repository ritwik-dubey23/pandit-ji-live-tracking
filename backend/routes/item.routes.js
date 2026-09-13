import express from "express";

import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { addItem, deleteItem, editItem, getItemByCity, getItemById } from "../controllers/item.controller.js";
// jo logic udhar controller me likha h uska route create jr rhe  h

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);


itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);



itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);



// item lane ke liye city ke according 
itemRouter.get("/get-by-city/:city", isAuth, getItemByCity);

// itemRouter.get("/delete/:itemId", isAuth, deleteItem);

itemRouter.delete("/delete/:itemId", isAuth, deleteItem);
export default itemRouter;