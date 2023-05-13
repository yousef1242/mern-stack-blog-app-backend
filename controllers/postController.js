const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { Post, validationCreatePost } = require('../models/post');
const {cloudinaryUploadImage, cloudinaryDeleteImage} = require('../utils/cloudinary');
const { validationUpdatePost } = require('../models/post');
const {Comment} = require('../models/comment')


// create new post
const addPostCtr = asyncHandler(async(req,res) => {
    // validation for image
    if (!req.file) {
        return res.status(400).json({message : 'no image provided'})
    }
    // validation for data
    const {error} = validationCreatePost(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    // upload photo
    const pathImage = path.join(__dirname,`../images/${req.file.filename}`)
    const result = await cloudinaryUploadImage(pathImage)
    // create new post and save it in DB
    const post = new Post({
        title : req.body.title,
        description : req.body.description,
        category : req.body.category,
        user : req.user.id,
        image : {
            url : result.secure_url,
            publicId : result.public_id,
        },
    })
    await post.save()
    // send response to client
    res.status(200).json({message : "Post has been created",post})
    // remove images from server // images folder
    fs.unlinkSync(pathImage)
})


// get all posts
const getAllPostCtr = asyncHandler(async(req,res) => {
    const PAGE_PER_PAGE = 3;
    const {pageNumber, category} = req.query
    let posts;

    if (pageNumber) {
        posts = await Post.find()
        .skip((pageNumber - 1) * PAGE_PER_PAGE)
        .limit(PAGE_PER_PAGE)
        .sort({createdAt : -1})
        .populate('user',["-password"])
    }else if (category){
        posts = await Post.find({ category : category })
        .sort({createdAt : -1})
        .populate('user',["-password"])
    }else{
        posts = await Post.find()
        .sort({createdAt : -1})
        .populate('user',["-password"]) // to get all information about user without password
    }
    res.status(200).json(posts)
});



// get single posts
const getSinglePostCtr = asyncHandler(async(req,res) => {
    let posts;
    
    posts = await Post.findById(req.params.id)
    .populate('user',["-password"]).populate('comments') // to get all information about user without password

    if (!posts) {
        return res.status(404).json({message : 'post not found'})
    }
    res.status(200).json(posts)
});


// get count posts
const getCountPostCtr = asyncHandler(async(req,res) => {
    let posts;
    posts = await Post.count()
    res.status(200).json(posts)
});


// delete single posts
const deleteSinglePostCtr = asyncHandler(async(req,res) => {
    
    let post = await Post.findById(req.params.id)

    if (!post) {
        return res.status(404).json({message : 'post not found'})
    }

    if (req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryDeleteImage(post.image.publicId)

        //delete comments thet belong to this post
        await Comment.deleteMany({ postId :  post._id});

        res.status(200).json({ message: 'post has been deleted', postId: post._id });
    } else {
        return res.status(400).json({ message: 'you are not owner for the post or not the admin' });
    }
});


// update post
const updateSinglePostCtr = asyncHandler(async(req,res) => {
    const {error} = validationUpdatePost(req.body)
    if(error){
        return res.status(400).json(error.details[0].message)
    }
    let post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message : 'post not found'})
    }
    if (req.user.id === post.user.toString()) {
        const updatePost = await Post.findByIdAndUpdate(req.params.id,{
            $set : {
                title : req.body.title,
                description : req.body.description,
                category : req.body.category,
            }
        },{new : true}).populate('user',['-password']).populate('comments')
        res.status(200).json(updatePost)
    }else{
        return res.status(400).json({message : 'your are not owner to update '})
    }
});

// update post image
const updateImagePostCtr = asyncHandler(async(req,res) => {
    if(!req.file){
        return res.status(400).json({message : 'file no provided'})
    }
    let post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message : 'post not found'})
    }
    if (req.user.id === post.user.toString()) {
        const imagePath = path.join(__dirname,`../images/${req.file.filename}`)
        await cloudinaryDeleteImage(post.image.publicId)
        const result = await cloudinaryUploadImage(imagePath)
        const updatePostImage = await Post.findByIdAndUpdate(req.params.id,{
            $set : {
                 image : {
                    url : result.secure_url,
                    publicId : result.public_id
                }
            }
        },{new : true})
        res.status(200).json({message : "image has been updated",updatePostImage})
        fs.unlinkSync(imagePath)
    }else{
        return res.status(400).json({message : 'your are not owner to update the image '})
    }
});

// toggle like on post
const toggleLikePostCtr = asyncHandler(async(req,res) => {
    let loggedInUser = req.user.id 

    let post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({message : 'post not found'})
    }
    const isPostAlreadyLiked = post.likes.find((user) => user.toString() === loggedInUser)
    if (isPostAlreadyLiked) {
        post = await Post.findByIdAndUpdate(req.params.id,{
            $pull : {likes : loggedInUser} // remove loggedInUser from array
        },{new : true})
    }else{
        post = await Post.findByIdAndUpdate(req.params.id,{
            $push : {likes : loggedInUser} // add loggedInUser from array
        },{new : true})
    }
    res.status(200).json(post)
})



module.exports = {
    addPostCtr,
    getAllPostCtr,
    getSinglePostCtr,
    getCountPostCtr,
    deleteSinglePostCtr,
    updateSinglePostCtr,
    updateImagePostCtr,
    toggleLikePostCtr,
}