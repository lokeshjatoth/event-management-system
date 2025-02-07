import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "image",
            folder: "Event"
        });
        return result;
    } catch (error) {
        console.error("Error uploading image to cloudinary:", error);
        throw error;
    }
};

export const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
        throw error;
    }
};