const express = require("express");
const app = express();

const mongoose = require("mongoose");

//Database
const database = module.exports = () => {
    const connectionParams = {
        useNewUrlParser:true,
        useUnifiedTopology: true,
    };
    
    try {
        mongoose.connect(
        "mongodb+srv://rakeshmohan1999:7MYUpihfunkFkf5g@cluster0.34g0wq7.mongodb.net/mongodb?retryWrites=true&w=majority&appName=AtlasApp",
        connectionParams
        );
        console.log('Database connected successfully')
    } catch (error) {
        console.log(error);
        console.log('Database connection failed');

    }
}

database();

module.exports = database;
