const cloudinary = require('./cloudConfig')
const fs = require("fs");

const uploadOnCloudinary = async(filepath) => {
    if (!filepath) {
        return null;
    }
    try {
        // Upload file on Cloudinary
        const result = await cloudinary.uploader.upload(filepath, {
            resource_type: 'auto',
            folder: 'wanderlust'
        });

        // Delete local file after success
        fs.unlink(filepath, (err) => {
            if (err) throw new Error(err);
            console.log(filepath + "file was deleted");
        });
        return result.secure_url;
    } catch (error) {
        console.log(error);

        // always try deleting local file even on failure
        fs.unlink(filepath, (err) => {
            if (err) throw new Error("Error deleting file");
            console.log(filepath + "file was deleted");
        });
        return null;
    }
};

module.exports = uploadOnCloudinary;