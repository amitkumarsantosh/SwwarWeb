const Listing = require("../schemas/listing");
const ExpressError = require("../utils/ExpressError");
const axios = require('axios');

// ===============================
// Index Route - Show all listings
// ===============================
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// ==========================================
// Render Form to Create a New Listing
// ==========================================
module.exports.renderNewListingFrom = (req, res) => {
  // console.log(req.user);
  res.render("listings/new");
};

// ==========================================
// Handle Form Submission for a New Listing
// ==========================================
module.exports.submitListingForm = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const address = req.body.location;
  const apiKey = process.env.MAP_API;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  const saving_result = await newListing.save();
  req.flash("success", "New Listing Created successfully");
  res.redirect(`/listings/${saving_result._id}`);
};

// ====================================================
// Show a Specific Listing with Populated Reviews/Owner
// ====================================================
module.exports.renderShowListing = async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");

  // console.log(listing);

  if (!listing) return next(new ExpressError(404, "Listing not found"));
  res.render("listings/show", { listing });
};

// =======================================
// Render Form to Edit an Existing Listing
// =======================================
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  let originalImage = listing.image.url;
  let transformedImage = originalImage.replace("/upload", "/upload/h_300,w_200");

  res.render("listings/edit", { listing, originalImage });
};

// =======================================================
// Handle Form Submission to Save Edited Listing (delete)
// =======================================================
module.exports.saveEditedForm = async (req, res) => {
  const { id } = req.params;

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully");
  res.redirect("/listings");
};
