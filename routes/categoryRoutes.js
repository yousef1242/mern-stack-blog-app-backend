const router = require('express').Router()
const {createNewCategoryCrt, getAllCategoryCrt, deleteCategoryCrt} = require('../controllers/categoryController')
const { validateObjectId } = require('../middlewares/objectValidate')
const { verifyToken, verifyTokenAndAdmin } = require('../middlewares/verifyToken')


router.post('/',verifyTokenAndAdmin,createNewCategoryCrt)

router.get('/',getAllCategoryCrt)

router.delete('/delete/:id',verifyTokenAndAdmin,validateObjectId,deleteCategoryCrt)


module.exports = router