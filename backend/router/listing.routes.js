const express = require("express");
const isVerifyUser = require("../middleware/isVerifyUser");
const router = express.Router();
const listingModel = require("../schema/listing.model");
const uploads = require("../middleware/multer");
const uploadOnCloudinary = require("../cloudinary/uploadOnCloudinary");

router.post("/addlist", isVerifyUser, uploads.single("image"), async(req, res) => {
    console.log(req.file);


    const { title, description, price, location, country } = req.body;
    console.log(req.user);

    // // check if file is missisng 
    // if (!req.file) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Image is required Please upload an image",
    //     })
    // }

    try {

        // Upload file to cloudinary

        let imageUrl = await uploadOnCloudinary(req.file.path);
        console.log(imageUrl);

        if (!imageUrl) {
            return res.status(400).json({
                success: false,
                message: "Please upload an image.",
            });
        }

        // Create a new listing

        const list = await listingModel.create({
            title,
            description,
            price,
            location,
            country,
            image: imageUrl,
            createdby: req.user,
        });
        res.status(200).json({
            success: true,
            message: "List added successfully",
            post: list,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get("/alllist", async(req, res) => {
    try {
        const list = await listingModel
            .find({})
            .sort({ createdAt: -1 })
            .populate("createdby", "name email avatar")
            .populate({
                path: "rating",
                populate: {
                    path: "ratedby",
                    select: "name email avatar",
                },
            })
            .populate({
                path: "comment",
                populate: {
                    path: "commentedby",
                    select: "name email avatar",
                },
            });

        // populate({
        //   path:'createdby',          ====  populate("createdby" , "name email avatar")
        // select:"name email avatar"
        // });

        //  populate:{
        //     path:'ratedby',
        //     select:'name email avatar'
        //   }
        res.status(200).json({
            success: true,
            message: "List fetched successfully",
            total_results: list.length,
            total_list: list,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.get("/yourlist", isVerifyUser, async(req, res) => {
    try {
        const list = await listingModel
            .find({ createdby: req.user })
            .sort({ createdAt: -1 })
            .populate("createdby", "name email avatar")
            .populate({
                path: "rating",
                populate: {
                    path: "ratedby",
                    select: "name email avatar",
                },
            })
            .populate({
                path: "comment",
                populate: {
                    path: "commentedby",
                    select: "name email avatar",
                },
            });
        res.status(200).json({
            success: true,
            message: "List fetched successfully",
            total_results: list.length,
            total_list: list,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.put("/like/:listId", isVerifyUser, async(req, res) => {
    const { listId } = req.params;

    const list = await listingModel.findById(listId);
    let index = list.like.indexOf(req.user);
    let isLike = true;
    if (index > -1) {
        list.like.splice(index, 1);
        isLike = false;
    } else {
        list.like.push(req.user);
    }

    const post = await list.save();
    res.status(200).json({
        success: true,
        message: isLike ? "List liked successfully" : "list dislike successfully",
        isLike: isLike,
        post: post,
    });
});

router.put("/updatelist/:listId", isVerifyUser, async(req, res) => {
    const { listId } = req.params;
    const { title, description, price, location, country } = req.body;
    try {
        let mylist = await listingModel.findById(listId);
        if (title) mylist.title = title;
        if (description) mylist.description = description;
        if (price) mylist.price = price;
        if (location) mylist.location = location;
        if (country) mylist.country = country;

        const list = await mylist.save();
        console.log(list);
        console.log(mylist);
        res.status(200).json({
            success: true,
            message: "List updated successfully",
            post: list,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.delete("/deletelist/:listId", isVerifyUser, async(req, res) => {
    const { listId } = req.params;
    try {
        const list = await listingModel.findByIdAndDelete(listId);
        res.status(200).json({
            success: true,
            message: "List deleted successfully",
            post: list,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;