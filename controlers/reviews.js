const Listing = require("../schemas/listing");
const Review = require("../schemas/Review");
const ExpressError = require("../utils/ExpressError");

// ====================
// ➕ Create Review
// ====================
module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  console.log("⏺️ POST /reviews hit");
  console.log("Params:", req.params);
  console.log("Body:", req.body);

  const reviewData = req.body.review;
  reviewData.rating = Number(reviewData.rating); // Ensure rating is a number

  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  const newReview = new Review(reviewData);
  newReview.author = req.user._id;

  // console.log(newReview);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${id}`);
};

// ====================
// ❌ Delete Review
// ====================
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
};
