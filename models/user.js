const mongoose  = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userShcema = new mongoose.Schema({
        username : {
            type : String,
            required : true,
            trim : true,
            minlength : 2,
            maxlength : 100,
        },
        email : {
            type : String,
            required : true,
            trim : true,
            minlength : 5,
            maxlength : 100,
            unique : true,
        },
        password : {
            type : String,
            required : true,
            trim : true,
            minlength : 8,
        },
        imageProfile : {
            type : Object,
            default : {
                url : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                publicId : null
            }
        },
        bio : {
            type : String,
        },
        isAdmin : {
            type : Boolean,
            default : false,
        },
        isAccountVerified : {
            type : Boolean,
            default : false,
        },
    },{
        timestamps : true,
        toJSON : { virtuals : true }, // for virtual work
        toObject : { virtuals : true } // for virtual work
    })

    //get posts for profile of user
    userShcema.virtual('posts',{ // he will add posts in shcema for user when get the user profile
        ref : 'Post',
        foreignField : "user",
        localField : "_id"
    })


    //generate auth token
    userShcema.methods.genrateAuthToken = function(){
        return jwt.sign({id : this._id, isAdmin : this.isAdmin},process.env.JWT_SECRET)
    }


const User = mongoose.model('User',userShcema) 


// validate register
const validateRigisterUser = (obj) => {
    const schema = Joi.object({
        username : Joi.string().trim().min(2).max(100).required(),
        email : Joi.string().trim().min(2).max(100).required(),
        password : Joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}
// validate login
const validateLoginUser = (obj) => {
    const schema = Joi.object({
        email : Joi.string().trim().min(2).max(100).required(),
        password : Joi.string().trim().min(8).required(),
    })
    return schema.validate(obj)
}
// validate update
const validateLoUpdateUser = (obj) => {
    const schema = Joi.object({
        username : Joi.string().trim().min(2).max(100),
        password : Joi.string().trim().min(8),
        bio : Joi.string()
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateRigisterUser,
    validateLoginUser,
    validateLoUpdateUser

}