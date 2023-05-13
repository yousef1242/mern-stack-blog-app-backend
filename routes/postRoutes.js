const router = require('express').Router()
const { addPostCtr, getAllPostCtr, getSinglePostCtr, getCountPostCtr, deleteSinglePostCtr, updateSinglePostCtr, updateImagePostCtr, toggleLikePostCtr } = require('../controllers/postController')
const photoUpload = require('../middlewares/photoUpload')
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken')
const {validateObjectId} = require('../middlewares/objectValidate')


router.post('/',verifyToken,photoUpload.single('image'),addPostCtr)

router.get('/',getAllPostCtr)

router.get('/count',getCountPostCtr)

router.get('/:id',validateObjectId,getSinglePostCtr)

router.delete('/delete/:id',verifyToken,validateObjectId,deleteSinglePostCtr)

router.post('/update/:id',verifyToken,validateObjectId,updateSinglePostCtr)

router.post('/update-image/:id',verifyToken,validateObjectId,photoUpload.single('image'),updateImagePostCtr)

router.post('/like/:id',verifyToken,validateObjectId,toggleLikePostCtr)





module.exports = router