const asyncHandler = require('express-async-handler')
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const {User, validateRigisterUser, validateLoginUser} = require('../models/user')

// register user
const registerUserCtr = asyncHandler(async(req,res) => {
    //validaion
    const {error} = validateRigisterUser(req.body)
    if (error) {
        return res.status(400).json({message : error.details[0].message})
    }
    //email is already exist
   let user =  await User.findOne({email : req.body.email})
    if (user) {
        return res.status(400).json({message : 'user already exist'})
    }
    //hash the password
    const hashedPassword = await bcryptjs.hash(req.body.password,10)
    //new user and save it to db
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword,
    })
    await newUser.save()
    //send response to client
    res.status(201).json({message : 'you registered seccessfuly'})

})


// login user
const loginUserCtr = asyncHandler( async(req,res) => {
    //vaildate check
    const {error} = validateLoginUser(req.body)
    if (error) {
        return res.status(400).json({message : error.details[0].message})
    }
    //is user exist
    const user = await User.findOne({email : req.body.email})
    if (!user) {
        return res.status(400).json({message : 'email is not found'})
    }
    //check the password
    const passwordCompare = await bcryptjs.compare(req.body.password,user.password)
    if (!passwordCompare) {
        return res.status(400).json({message : 'passord does not match'})
    }

    //generate jwt
    const token = user.genrateAuthToken()
    //send response to client
    res.status(200).json({
        _id : user._id,
        imageProfile : user.imageProfile,
        isAdmin : user.isAdmin,
        token,
        username : user.username,

    })
})
module.exports = {
    registerUserCtr,
    loginUserCtr,
}