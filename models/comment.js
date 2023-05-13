const mongoose = require('mongoose')
const joi = require('joi')



const commentShcema = new mongoose.Schema({
    postId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Post',
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    text : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
    },
},{
    timestamps : true,
    // toJSON : { virtuals : true },
    // toObject : { virtuals : true }
})



const Comment = mongoose.model('Comment',commentShcema)


const vlidateAddComment = (obj) => {
    const Shcema = joi.object({
        postId :joi.string().required().label('Post ID') ,
        text : joi.string().trim().required(),
    })
    return Shcema.validate(obj)
}


const vlidateUpdateComment = (obj) => {
    const Shcema = joi.object({
        text : joi.string().trim().required(),
    })
    return Shcema.validate(obj)
}

module.exports = {
    Comment,
    vlidateAddComment,
    vlidateUpdateComment,
}



