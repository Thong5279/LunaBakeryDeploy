const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB ket noi thanh cong");

    }catch(err){
        console.log("kết nối ko thành công MongoDB");
        process.exit(1);
    }
};

module.exports = connectDB;