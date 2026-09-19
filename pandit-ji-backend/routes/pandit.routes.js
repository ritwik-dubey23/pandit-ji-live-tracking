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
    updateBackgroundPhoto,
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
panditRouter.post("/profile", isAuth, upload.single("profileImage"), createOrUpdateProfile);
panditRouter.post("/profile-photo", isAuth, upload.single("profileImage"), updateProfilePhoto);
panditRouter.post("/background-photo", isAuth, upload.single("backgroundImage"), updateBackgroundPhoto);
panditRouter.post("/service", isAuth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'photos', maxCount: 10 }]), addOrUpdateService);
panditRouter.post("/service/:serviceId/photos", isAuth, upload.array("photos", 10), addServicePhotos);
panditRouter.post("/service/:serviceId/delete-photo", isAuth, deleteServicePhoto);
panditRouter.delete("/service/:serviceId", isAuth, deleteService);

export default panditRouter;
