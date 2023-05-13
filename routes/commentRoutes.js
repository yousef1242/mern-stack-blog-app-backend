const router = require('express').Router()
const { createNewComment, getAllComments, deleteComment, updateComment } = require('../controllers/commentController')
const { validateObjectId } = require('../middlewares/objectValidate')
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken')


router.post('/',verifyToken,createNewComment)

router.get('/',verifyToken,verifyTokenAndAdmin,getAllComments)

router.delete('/delete/:id',verifyToken,validateObjectId,deleteComment)

router.post('/update/:id',verifyToken,validateObjectId,updateComment)

module.exports = router