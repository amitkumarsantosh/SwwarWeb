const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URL1= process.env.MONGO_URL;



const connectDB = async ()=>{
    try{
        await mongoose.connect(MONGO_URL1);
        console.log('✅ MongoDB Connected')
    }catch(err){
        console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit process with failure

    }
}
module.exports = connectDB;
