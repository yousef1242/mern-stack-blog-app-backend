const cloudinary = require('cloudinary')


cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})



//cloudiry upload image

const cloudinaryUploadImage = async(fileToUpload) => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload,{ // upload image
            resource_type : 'auto',
        }) 
        return data;
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (cloudinary");
    }
}



//cloudiry delete image

const cloudinaryDeleteImage = async(imagePublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId) // remove image
        return result
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (cloudinary");
    }
}


const cloudinaryDeleteManyImages = async(publicIds) => {
    try {
        const result = await cloudinary.v2.api.delete_resources(publicIds) // remove many not one  image
        return result
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error (cloudinary");
    }
}

module.exports = {
    cloudinaryDeleteImage,
    cloudinaryUploadImage,
    cloudinaryDeleteManyImages,
}