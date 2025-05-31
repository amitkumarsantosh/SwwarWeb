const User = require("../schemas/Users");
const ExpressError = require("../utils/ExpressError");

// ====================
// ➕ Render Signup Form
// ====================
module.exports.renderSignupForm = async (req, res) => {
  res.render("listings/signup");
};

// ====================
// ✅ Handle Signup
// ====================
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body.user;
    const newUser = new User({ email, username });

    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "User registered successfully");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// ====================
// 🔓 Render Login Form
// ====================
module.exports.renderLoginForm = async (req, res) => {
  res.render("listings/login");
};

// ====================
// ✅ Handle Login
// ====================
module.exports.login = async (req, res) => {
  req.flash("success", "Login Successful");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// ====================
// 🚪 Logout
// ====================
module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "You are now logged out");
    res.redirect("/listings");
  });
};
