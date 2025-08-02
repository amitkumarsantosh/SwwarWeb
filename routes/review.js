const express = require("express");
const router = express.Router({ mergeParams: true });

const { createReview, deleteReview } = require("../controlers/reviews");
const wrapAsync = require("../utils/wrapAsync");
const { validateReview } = require("../JOIValidation");
const { isLoggedIn, isReviewAuthor } = require("../middleware");

// ➕ Add Review
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// ❌ Delete Review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(deleteReview));

module.exports = router;
