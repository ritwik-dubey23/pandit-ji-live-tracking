import express from "express";
import {
    getAllPandits,
    getPanditById,
    getMyPanditProfile,
    createOrUpdateProfile,
    addOrUpdateService,
    deleteService,
    toggleOnline,
    updateProfilePhoto,
    addServicePhotos,
    deleteServicePhoto
} from "../controllers/pandit.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const panditRouter = express.Router();

panditRouter.get("/", getAllPandits);
panditRouter.get("/my-profile", isAuth, getMyPanditProfile);
panditRouter.put("/toggle-online", isAuth, toggleOnline);
panditRouter.get("/:id", getPanditById);
panditRouter.post("/profile", isAuth, upload.array("photos", 5), createOrUpdateProfile);
panditRouter.post("/profile-photo", isAuth, upload.single("profileImage"), updateProfilePhoto);
panditRouter.post("/service", isAuth, upload.single("image"), addOrUpdateService);
panditRouter.post("/service/:serviceId/photos", isAuth, upload.array("photos", 10), addServicePhotos);
panditRouter.post("/service/:serviceId/delete-photo", isAuth, deleteServicePhoto);
panditRouter.delete("/service/:serviceId", isAuth, deleteService);

export default panditRouter;
