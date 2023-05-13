const asyncHandler = require('express-async-handler')
const { User, validateLoUpdateUser } = require('../models/user');
const { Post } = require('../models/post');
const { Comment } = require('../models/comment');
const path  = require('path');
const bcrypt = require('bcryptjs');
const { cloudinaryUploadImage, cloudinaryDeleteImage, cloudinaryDeleteManyImages } = require('../utils/cloudinary');
const fs = require('fs') //file system in nodejs



//get all users profile
const getAllUsersProfile = asyncHandler(async(req,res) => {
    const users = await User.find({}).select('-password').populate('posts');// for i do not need password
    res.status(200).json(users)
})



//get user profile
const getAUsersProfileById = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id).select('-password').populate('posts');// for i do not need password
    if (!user) {
        return res.status(404).json({message : 'user is not found'})
    }
    res.status(200).json(user)
})

/**-------------------------------------
 *  @dec update user profile
 * @route /api/user/profile/:id
 * @method PUT
 * @access private (user only)
 -------------------------------------*/

 const updateUserProfile = asyncHandler(async(req,res) => {
    const id = req.params.id
    const {error} = validateLoUpdateUser(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password,10)
    }
    const updatesUser = await User.findByIdAndUpdate(id,{
        $set:{
            username : req.body.username,
            password : req.body.password,
            bio : req.body.bio
        }
    },{new : true}).select('-password').populate('posts');
    res.status(200).json(updatesUser)
 })


 //get all users Count
const getAllUsersCount = asyncHandler(async(req,res) => {
    const count = await User.count();// for i do not need password
    res.status(200).json(count)
})

/**-------------------------------------
 *  @dec update user photo
 * @route /api/user/profile/profile-photo-upload
 * @method POST
 * @access private (logged user only)
 -------------------------------------*/
 const uploadPhotoImageUser = asyncHandler(async (req, res) => {
    // validate file
    if (!req.file) {
      return res.status(400).json({ message: 'no file provided' });
    }
  
    // get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  
    // upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath);
  
    // get the user from DB
    const user = await User.findById(req.user.id);
  
    // delete the old profile photo if it exists
    if (user.imageProfile.publicId !== null) {
      await cloudinaryDeleteImage(user.imageProfile.publicId);
    }
  
    // update the profile photo field in the DB
    user.imageProfile = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();
  
    // send response to client
    res.status(200).json({
      message: 'your profile photo uploaded successfully',
      profilePhoto: { url: result.secure_url, publicId: result.public_id },
    });
  
    //remove image from server //images folder
    fs.unlinkSync(imagePath);
  });


/**-------------------------------------
 *  @dec delete user profile (Account)
 * @route /api/users/profile/delete/:id
 * @method DELETE
 * @access private (only user him self)
 -------------------------------------*/

 const deleteUserProfile = asyncHandler(async (req, res) => {
    // get the user from DB
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: 'user not found' });
    }
  
    // @TODO get all posts from DB
    const posts = await Post.find({ user : user._id });
    // @TODO get the public ids from the posts
    const publicIds = posts?.map(post => post.image.publicId )
    // @TODO delete all posts image from cloudinary thet belong to this user
    if (publicIds?.length > 0) { //  ? => if publicIds === null the if will not working
      await cloudinaryDeleteManyImages(publicIds)
    }
    // delete the profile picture from the cloudinary
    if(user.imageProfile.publicId !== null){
      await cloudinaryDeleteImage(user.imageProfile.publicId);
    }
  
    // @TODO delete the user posts & comments
    await Post.deleteMany({user : user._id})
    await Comment.deleteMany({user : user._id})
    // delete the user himself
    await User.findByIdAndDelete(req.params.id);
  
    // send a response to client
    res.status(200).json({ message: 'your profile has been deleted' });
  });



module.exports = {
    getAllUsersProfile,
    getAUsersProfileById,
    updateUserProfile,
    getAllUsersCount,
    uploadPhotoImageUser,
    deleteUserProfile,
}