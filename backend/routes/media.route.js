import express from "express";
import upload from "../utils/multer.js";
import { uploadImage } from "../utils/cloudinary.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();


router.post("/upload-image", authenticate, upload.single("file"), async (req, res) => {
    try{
        const result = await uploadImage(req.file.path);
        return res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            data: result,
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Failed to upload Image",
        });
    }
})

export default router;