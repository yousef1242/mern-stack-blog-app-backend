const asyncHandler = require('express-async-handler')
const {Category,vlidateAddCategory} = require('../models/category')

//create new category
const createNewCategoryCrt = asyncHandler(async(req,res) => {
    const {error} = vlidateAddCategory(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message)
    }
        const addCategory = new Category({
            title : req.body.title,
            user : req.user.id
        })
        await addCategory.save()
     res.status(200).json(addCategory)
})

//get all categories
const getAllCategoryCrt = asyncHandler(async(req,res) => {
    const categories = await Category.find()
     res.status(200).json(categories)
})

//delete category
const deleteCategoryCrt = asyncHandler(async(req,res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) {
        return res.status(400).json({message : 'category not found'})
    }
     res.status(200).json({message : 'category has been deleted',categoryId : category._id})
})


module.exports = {
    createNewCategoryCrt,
    getAllCategoryCrt,
    deleteCategoryCrt,
}