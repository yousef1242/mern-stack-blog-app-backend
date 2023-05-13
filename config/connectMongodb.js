const { default: mongoose } = require("mongoose");

const connectMongodb = async () => {
    try {
       await mongoose.connect(process.env.CONNECT_MONGODB)
       console.log('connect mongodb');
    } catch (error) {
        console.log('faild to connect mongodb', error);
    }
}



module.exports = {
    connectMongodb
}