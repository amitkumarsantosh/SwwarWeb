const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware");

const users = require("../controlers/users");

// ➕ Signup
router.get("/signup", wrapAsync(users.renderSignupForm));
router.post("/signup", wrapAsync(users.signup));

// 🔓 Login
router.get("/login", wrapAsync(users.renderLoginForm));
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(users.login)
);

// 🚪 Logout
router.get("/logout", users.logout);

module.exports = router;
