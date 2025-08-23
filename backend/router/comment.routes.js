const express = require("express");
const isVerifyUser = require("../middleware/isVerifyUser");
const router = express.Router();
const listingModel = require("../schema/listing.model");
const commentModel = require("../schema/comments.model");


router.post("/add/:listId", isVerifyUser, async(req, res) => {
    const { listId } = req.params;
    const { text } = req.body;
    try {
        const post = await listingModel.findById(listId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        const comment = await commentModel.create({
            text,
            post: listId,
            commentedby: req.user,
        });

        post.comment.push(comment._id);
        const updatedPost = await post.save();
        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            post: updatedPost,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

router.put("/update", isVerifyUser, async(req, res) => {
    const { listId } = req.params;
    const { text } = req.body;

    try {
        const comment = await commentModel.findOne({
            post: listId,
            commentedby: req.user,
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or not authorized",
            });
        }

        if (text) comment.text = text;

        await comment.save();

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment,
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

});

router.delete("/delete", isVerifyUser, async(req, res) => {
    const { listId } = req.params;

    try {
        const comment = await commentModel.findOneAndDelete({
            post: listId,
            commentedby: req.user,
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found or not authorized",
            });
        }

        // Remove comment reference from listing
        await listingModel.findByIdAndUpdate(listId, {
            $pull: { comment: comment._id },
        });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
        });

    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

module.exports = router;