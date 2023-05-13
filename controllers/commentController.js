const asyncHandler = require('express-async-handler')
const { Comment,vlidateAddComment,vlidateUpdateComment  } = require('../models/comment')
const { User } = require('../models/user')


const createNewComment = asyncHandler(async(req,res) => {
    const {error} = vlidateAddComment(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    const profile = await User.findById(req.user.id)

    const comment = new Comment({
        postId : req.body.postId,
        text : req.body.text,
        user : req.user.id,
        username : profile.username,
    })
    await comment.save()

    res.status(201).json(comment)
})

// get all comments for admin
const getAllComments = asyncHandler(async(req,res) => {
    const comments = await Comment.find().populate('user',['-password'])
    res.status(200).json(comments)
})


// delete comment for admin or own comment (user)
const deleteComment = asyncHandler(async(req,res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(400).json({message : 'comment not found'})
    }
    if (req.user.isAdmin || req.user.id === comment.user.toString()) {        
        await Comment.findByIdAndDelete(req.params.id)
        res.status(200).json({message : 'comment has been deleted'})
    }
    res.status(400).json({message : 'you are not the owner of comment or admin'})
})


// update comment for  own comment (user)
const updateComment = asyncHandler(async(req,res) => {
    const {error} = vlidateUpdateComment(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }

    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(400).json({message : 'comment not found'})
    }
    if (req.user.id === comment.user.toString()) {        
        const user = await Comment.findByIdAndUpdate(req.params.id,{
            $set : {
                text : req.body.text,
            }
        },{new : true});
        res.status(200).json(user)
    }
    res.status(400).json({message : 'you are not the owner of comment or admin'})
})


module.exports = {
    createNewComment,
    getAllComments,
    deleteComment,
    updateComment,
}
