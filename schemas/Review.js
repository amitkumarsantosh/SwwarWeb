const { ref } = require('joi');
const mongoose = require('mongoose');
const User = require("./Users");
const Schema = mongoose.Schema; // Capital 'S' for Schema
const reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now()

    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
  
});

module.exports = mongoose.model('Review', reviewSchema);
