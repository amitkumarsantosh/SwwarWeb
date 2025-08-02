// =========================
// ✅ Required Module
// =========================
const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');


// =========================
// ✅ Listing Schema
// =========================
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.string().required(),
    image: Joi.string().allow("", null) // Optional image field
  }).required()
});


// =========================
// ✅ Review Schema
// =========================
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5)
  }).required()
});

