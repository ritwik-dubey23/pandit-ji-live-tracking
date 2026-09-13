import express from "express";

import { getCurrUser, updateUserLocation } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";
// jo logic udhar controller me likha h uska route create jr rhe  h

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrUser);

userRouter.post("/update-location", isAuth, updateUserLocation);



export default userRouter;