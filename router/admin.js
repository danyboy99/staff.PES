const express = require("express");
const adminController = require("../controller/admin");
const passport = require("passport");
const Staff = require("../model/staff");
const Evaluation = require("../model/evaluation");
const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  let message = "you must be loggedin to access a private route";
  let errMsg = [];
  errMsg.push(message);
  req.flash("error", errMsg);
  return res.redirect("/");
};

router.get("/", (req, res) => {
  const errMsg = req.flash("error");
  const successMsg = req.flash("success");
  return res.render("admin/login", {
    hasErr: errMsg.length > 0,
    errMsg: errMsg,
  });
});
router.post("/create", adminController.createAdmin);
router.get("/homepage", isLoggedIn, adminController.isAdmin, (req, res) => {
  const errMsg = req.flash("error");
  const successMsg = req.flash("success");
  return res.render("admin/homepage", {
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    errMsg: errMsg,
    successMsg: successMsg,
  });
});
router.post(
  "/login",
  passport.authenticate("admin.login", {
    failureRedirect: "/admin",
    failureFlash: true,
    successRedirect: "/admin/homepage",
  })
);
router.post(
  "/newevaluation",
  adminController.isAdmin,
  adminController.createEvaluation
);
router.get("/createstaff", adminController.isAdmin, (req, res) => {
  const errMsg = req.flash("error");
  const successMsg = req.flash("success");
  return res.render("admin/createstaff", {
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    errMsg: errMsg,
    successMsg: successMsg,
  });
});
router.get("/allstaff", adminController.isAdmin, async (req, res) => {
  const staffs = await Staff.find();
  return res.render("admin/allstaff", {
    staffs: staffs,
  });
});
router.get("/createevaluation", adminController.isAdmin, async (req, res) => {
  const staffs = await Staff.find();
  const errMsg = req.flash("error");
  const successMsg = req.flash("success");
  return res.render("admin/createevaluation", {
    staffs: staffs,
    hasErr: errMsg.length > 0,
    hasSuccess: successMsg.length > 0,
    errMsg: errMsg,
    successMsg: successMsg,
  });
});
router.get("/allevaluation", adminController.isAdmin, async (req, res) => {
  const evaluations = await Evaluation.find();
  return res.render("admin/allevaluation", {
    evaluation: evaluations,
  });
});
router.get("/staffevaluation", adminController.isAdmin, async (req, res) => {
  const staffs = await Staff.find();
  return res.render("admin/staffevaluation", {
    staffs: staffs,
  });
});
router.get(
  "/staffevaluation/:fullname",
  adminController.isAdmin,
  adminController.staffEvaluation
);
module.exports = router;
