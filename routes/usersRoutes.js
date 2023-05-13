const { getAllUsersProfile, getAUsersProfileById, updateUserProfile, getAllUsersCount, uploadPhotoImageUser, deleteUserProfile } = require('../controllers/usersController')
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyTokenAndOnlyUserAndAdmin } = require('../middlewares/verifyToken')
const { verifyToken } = require('../middlewares/verifyToken')
const {validateObjectId} = require('../middlewares/objectValidate')
const photoUpload = require('../middlewares/photoUpload')
const router = require('express').Router()


router.get('/api/users/profile',verifyTokenAndAdmin,getAllUsersProfile)

router.post('/api/users/profile/profile-photo-upload',verifyToken,photoUpload.single("image") /* single image not more image */,uploadPhotoImageUser)

router.get('/api/users/profile/:id',validateObjectId,getAUsersProfileById)

router.post('/api/users/profile/:id',validateObjectId,verifyTokenAndOnlyUser,updateUserProfile)

router.delete('/api/users/profile/delete/:id',validateObjectId,verifyTokenAndOnlyUserAndAdmin,deleteUserProfile)

router.get('/api/users/count',verifyTokenAndAdmin,getAllUsersCount)



module.exports = router