const { default: mongoose } = require("mongoose");
require('dotenv').config()

const dbURI = process.env.DB_URI
const conntectDB = async() => {
    try {
        await mongoose.connect(dbURI);
        // await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3");
        console.log("connected to mongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB ", error);
    }
};

module.exports = conntectDB;