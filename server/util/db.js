const mongoose  = require('mongoose');

const URI = process.env.MONGODB_URI;


const connectDB = async()=>{
    try {
        await mongoose.connect(URI);
        console.log("Connection to DB Successful");
    } catch (error) {
        console.error("Connection to DB failed");
        process.exit(0);
    }
};

module.exports = connectDB;