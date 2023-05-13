const mongoose = require('mongoose')
const joi = require('joi')




const postShcema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true,
        minLength : 2,
        maxLength : 200,
    },
    description : {
        type : String,
        required : true,
        trim : true,
        minLength : 10,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    category : {
        type : String,
        required : true
    },
    image : {
        type : Object,
        default : {
            url : "",
            publicId : null,
        }
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User'
        }
    ]
},{
    timestamps : true,
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})

postShcema.virtual('comments',{
    ref : 'Comment',
    foreignField : 'postId',
    localField : '_id'
})


const Post = mongoose.model('Post',postShcema)


//validate create post

const validationCreatePost = (obj) => {
    const Shcema = joi.object({
        title : joi.string().trim().min(2).max(200).required(),
        description : joi.string().trim().min(10).required(),
        category : joi.string().trim().required(),
    })
    return Shcema.validate(obj)
}



const validationUpdatePost = (obj) => {
    const Shcema = joi.object({
        title : joi.string().trim().min(2).max(200),
        description : joi.string().trim().min(10),
        category : joi.string().trim(),
    })
    return Shcema.validate(obj)
}






module.exports = {
    validationCreatePost,
    validationUpdatePost,
    Post,
}