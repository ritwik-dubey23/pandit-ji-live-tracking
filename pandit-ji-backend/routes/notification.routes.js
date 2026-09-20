import express from "express";
import { getUserNotifications, markNotificationAsRead, markAllAsRead, deleteNotification } from "../controllers/notification.controller.js";
import isAuth from "../middlewares/isAuth.js";

const notificationRouter = express.Router();

notificationRouter.get("/", isAuth, getUserNotifications);
notificationRouter.put("/:id/read", isAuth, markNotificationAsRead);
notificationRouter.put("/read-all", isAuth, markAllAsRead);
notificationRouter.delete("/:id", isAuth, deleteNotification);

export default notificationRouter;
