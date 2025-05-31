// // =========================
// // ✅ Required Modules
// // =========================
// const express = require("express");
// const router = express.Router();
// const flash = require("connect-flash");

// const Listing = require("../schemas/listing");
// const Review = require("../schemas/Review");
// const wrapAsync = require("../utils/wrapAsync");
// const ExpressError = require("../utils/ExpressError");
// const { validateListingSchema } = require("../JOIValidation");
// const { isLoggedIn, isOwner } = require("../middleware");
// const listingController = require("../controlers/listings");

// // =========================
// // ✅ Routes for Listings
// // =========================

// // 🔸 Show All Listings
// router.get("/", wrapAsync(listingController.index));

// // 🔸 New Listing Form
// router.get("/new", isLoggedIn, listingController.renderNewListingFrom );

// // 🔸 Create Listing
// router.post("/new", isLoggedIn, validateListingSchema, wrapAsync(listingController.submitListingForm));

// // 🔸 Show Single Listing
// router.get("/:id", wrapAsync(listingController.renderShowListing));

// // 🔸 Edit Listing Form
// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// // 🔸 Update Listing
// router.put("/:id", isLoggedIn, isOwner, validateListingSchema, wrapAsync(async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//   res.redirect(`/listings/${id}`);
// }));

// // 🔸 Delete Listing 
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.saveEditedForm));

// // =========================
// // ✅ Export Router
// // =========================
// module.exports = router;


// =========================
// ✅ Required Modules
// =========================
const express = require("express");
const router = express.Router();
const Listing = require("../schemas/listing");

const wrapAsync = require("../utils/wrapAsync");
const { validateListingSchema } = require("../JOIValidation");
const { isLoggedIn, isOwner } = require("../middleware");
const listingController = require("../controlers/listings");
const multer  = require('multer');
const { storage } = require("../cloud_config");
const ExpressError = require("../utils/ExpressError");
const upload = multer({storage})



// =========================
// ✅ Routes for Listings
// =========================

// 🔸 Show All Listings
router.get("/", wrapAsync(listingController.index));

// 🔸 New Listing - Form and Submit
router
  .route("/new")
  .get(isLoggedIn, listingController.renderNewListingFrom)
  .post(isLoggedIn,  upload.single("listing[image]"), validateListingSchema,wrapAsync(listingController.submitListingForm));


// 🔸 Show, Update, and Delete Single Listing
router
  .route("/:id")
  .get(wrapAsync(listingController.renderShowListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListingSchema, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    
    if(req.file){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image= {url, filename};
      listing.save();

    }
    
    res.redirect(`/listings/${id}`);
  }))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.saveEditedForm));

// 🔸 Edit Listing Form
router.get("/:id/edit", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(listingController.renderEditForm));



// =========================
// ✅ Export Router
// =========================
module.exports = router;
