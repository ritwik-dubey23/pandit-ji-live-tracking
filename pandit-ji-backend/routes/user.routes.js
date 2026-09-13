import express from "express";
import { updateLocation } from "../controllers/user.controllers.js";
import isAuth from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.post("/location", isAuth, updateLocation);

export default userRouter;
