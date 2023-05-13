const mongoose = require('mongoose')
const joi = require('joi')



const categoryShcema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    title : {
        type : String,
        required : true,
        trim : true
    },
},{
    timestamps : true,
})



const Category = mongoose.model('Category',categoryShcema)


const vlidateAddCategory = (obj) => {
    const Shcema = joi.object({
        title : joi.string().trim().required(),
    })
    return Shcema.validate(obj)
}


const vlidateUpdatCategory = (obj) => {
    const Shcema = joi.object({
        title : joi.string().trim().required(),
    })
    return Shcema.validate(obj)
}

module.exports = {
    Category,
    vlidateAddCategory,
    vlidateUpdatCategory,
}



