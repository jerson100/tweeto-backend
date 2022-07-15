const {v2: cloudinary} = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})

const uploadFileCloudinary = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "twitto/users/profiles",
    });
};

const deleteFileCloduinary = async (public_id) => {
    return await cloudinary.uploader.destroy(public_id);
}

module.exports = {
    uploadFileCloudinary,
    deleteFileCloduinary
}