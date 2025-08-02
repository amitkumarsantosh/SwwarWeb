// =========================
// ✅ Load Environment Variables
// =========================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// =========================
// ✅ Required Core Modules
// =========================
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const ejsMate = require("ejs-mate");
const multer = require("multer");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// =========================
// ✅ Custom Modules
// =========================
const upload = multer({ dest: "uploads/" });
const geocodeRoutes = require("./geocode");
const User = require("./schemas/Users");
const ExpressError = require("./utils/ExpressError");
const connectDB = require("./utils/db_connect");
const listingsRoute = require("./routes/listings");
const reviewRoute = require("./routes/review");
const userRoute = require("./routes/user");
const wrapAsync = require("./utils/wrapAsync");

// =========================
// ✅ App Initialization
// =========================
const app = express();
const port = process.env.PORT || 8080;

// =========================
// ✅ Connect to MongoDB
// =========================
connectDB();

// =========================
// ✅ View Engine Setup
// =========================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =========================
// ✅ Middleware Setup
// =========================
app.use(cookieParser("signedcookiekey"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(geocodeRoutes);
app.use(cors());

// =========================
// ✅ Session Configuration
// =========================
const mongoStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "sessions",
  touchAfter: 24 * 3600,
});

mongoStore.on("error", () => {
  console.log("Error in MongoStore: ", error);
});

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));

// =========================
// ✅ Flash Messages
// =========================
app.use(flash());

// =========================
// ✅ Passport Authentication
// =========================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =========================
// ✅ Inject Flash + User Info into Views
// =========================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// =========================
// ✅ Simple Logger
// =========================
app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url}`);
  next();
});

// =========================
// ✅ Routes
// =========================
app.get("/", (req, res) => {
  console.log(req.signedCookies);
  res.redirect("/listings");
});

app.get(
  "/demouser",
  wrapAsync(async (req, res) => {
    const fakeUser = new User({
      email: "harsh@gmail.com",
      username: "harsh_sahu",
    });
    const registeredUser = await User.register(fakeUser, "Amit@123");
    res.json(registeredUser);
  })
);

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

// =========================
// 🔴 404 Handler
// =========================
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// =========================
// 🔴 Error Handler
// =========================
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  console.error(`ErrorName: ${err.name}, ErrorMessage: ${err.message}`);
  res.status(status).render("listings/error", { err });
});

// =========================
// ✅ Start Server
// =========================
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
