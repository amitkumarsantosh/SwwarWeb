// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Capital 'S' for Schema
const Review = require("./Review");
const User = require("./Users")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true // Title is now required
  },
  description: String,
  price:String,
  image: {
    url: String,
    filename:String
    
  },
  location: String,
  country: String,
  reviews:[
    {
    type:Schema.Types.ObjectId,
    ref:"Review"
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log("Reviews associated with the listing deleted successfully");
  } else {
    console.log("No reviews found");
  }
});

module.exports = mongoose.model('Listing', listingSchema);
