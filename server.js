const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
var session = require("express-session");
var passport = require("passport");
var flash = require("connect-flash");
var mongoStore = require("connect-mongo");
const adminRoutes = require("./router/admin");
const staffRoutes = require("./router/staff");

const app = express();
require("./config/passport.js");
// connect to database
mongoose
  .connect("mongodb://127.0.0.1:27017/SPES")
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err.message));
// config ejs view engine
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "Danilosessionsecret",
    resave: true,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/SPES",
    }),
    cookie: { maxAge: 180 * 60 * 1000 },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.get("/", (req, res) => {
  return res.render("index");
});

// set admin routes
app.use("/admin", adminRoutes);

//set staff routes
app.use("/staff", staffRoutes);

let port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
