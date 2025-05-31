const mogoose = require('mongoose');
const Listing = require("../schemas/listing");
const connectDB=  require("../utils/db_connect");
const initData = require("../utils/data");
connectDB();

const initDB= async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"6833659a17072c270d041a53"}))
    await Listing.insertMany(initData.data);

    console.log("Data was initiLized");

}
initDB();


