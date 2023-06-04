const mongoose = require('mongoose');
const mongoURI="mongodb://localhost:27017/noteflix?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

const connectToMongo=async()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected Succesfully");
    })
}

module.exports=connectToMongo;