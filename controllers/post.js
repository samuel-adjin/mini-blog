const Post = require("../models/post");
const User = require("../models/user");
const { getUserPost } = require("../Helpers/posts");
const { upload, deleteFile } = require("../Helpers/fileUpload");





const createPost = async (req, res) => {
    try {
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
        });

        //find auth user and push post onto the post array in the user model
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
            return res
                .status(500)
                .json({ success: false, msg: "Error: user not found!!! " });
        }
        // store user who makes the post id on the post table
        post.postedBy = req.user._id;
        const image = upload.single('image');
        image(req, res, async (err) => {
            if (err) {
                throw err;
            }
            if (req.file === undefined) {
                return res.status(400).json("No file selected");
            } else {
                post.image = req.file.path;
                await post.save();
                res.status(201).json({ success: true, data: post });
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

const editPost = async (req, res) => {
    try {
        const poster = getUserPost(req.user, req.post);
        if (!poster)
            return res.status(401).json({ success: false, error: "Not allowed" });
        const { id: postId } = req.params;
        const post = await Post.findOneAndUpdate({ _id: postId }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!post) {
            res
                .status(500)
                .json({ success: false, msg: "Error: post not updated!!! " });
        }
        res.status(200).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

const showAllPost = async (req, res) => {
    try {
        const posts = await Post.find({}).populate("postedBy");
        if (!posts) {
            res
                .status(500)
                .json({ success: false, msg: "Error: posts not be loaded!!! " });
        }
        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

const getPost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const post = await Post.findOne({ _id: postId }).populate("postedBy");
        if (!post) {
            res
                .status(500)
                .json({ success: false, msg: "Error: post not be loaded!!! " });
        }
        res.status(201).json({ success: true, data: post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
    }
};

const deletePost = async (req, res) => {
    try {
        const poster = getUserPost(req.user, req.post);
        if (!poster || !req.hasPerm)
            return res.status(401).json({ success: false, error: "Not allowed" });
        const { id: postId } = req.params;
        const post = await Post.findOneAndDelete({ _id: postId });
        if (!post) {
            res
                .status(500)
                .json({
                    success: false,
                    msg: "Error: Post can  not be found... deletion was not successfully!!! ",
                });
        }
        res.status(201).json({ success: true, msg: "Post deleted successfuly" });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
};

const searchPost = async (req, res) => {
    try {
        const { title } = req.query;
        const search = {};
        if (title) {
            search.title = title;
        }
        const posts = await Post.find(search).populate("postedBy");
        res.status(201).json({ success: true, data: posts });
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
};


const publishedPost = async (req, res) => {
    try {
        const poster = getUserPost(req.user, req.post);
        if (!poster)
            return res.status(401).json({ success: false, error: "Not allowed" });
        const { id: postId } = req.params;
        const post = await Post.findOne({ _id: postId });
        post.isPublished = true;
        await post.save();
        res.status(201).json({ success: true, msg: "Post published successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
}

const changeContentImage = async (req, res) => {
    try {
        const poster = getUserPost(req.user, req.post);
        if (!poster)
            return res.status(401).json({ success: false, error: "Not allowed" });
        const { id: postId } = req.params;
        const post = await Post.findOne({ _id: postId })
        const image = upload.single('image');
        image(req, res, async (err) => {
            if (err) {
                throw err;
            }
            if (req.file === undefined) {
                res.status(500).json({ success: false, msg: "no file selected" })
            }
            deleteFile(post.image)
            post.image = req.file.path;
            await post.save();
            res.status(201).json({ success: "true", msg: "Image changed successfully" });
        })
    } catch (error) {
        return res.status(500).json({ success: false, error });
    }
}

module.exports = { publishedPost, searchPost, deletePost, getPost, showAllPost, editPost, createPost, changeContentImage }
