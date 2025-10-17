const { default: mongoose } = require("mongoose");
require('dotenv').config()

const dbURI = process.env.DB_URI
const conntectDB = async() => {
    try {
        await mongoose.connect(dbURI);
        console.log("connected to mongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB ", error);
    }
};

module.exports = conntectDB;