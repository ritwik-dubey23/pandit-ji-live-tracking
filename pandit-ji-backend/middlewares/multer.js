import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});
