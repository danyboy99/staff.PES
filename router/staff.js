const express = require("express");
const staffController = require("../controller/staff");
const passport = require("passport");
const Staff = require("../model/staff");
const Evaluation = require("../model/evaluation");

const router = express.Router();

router.get("/", (req, res) => {
  const errMsg = req.flash("error");
  return res.render("staff/login", {
    hasErr: errMsg.length > 0,
    errMsg: errMsg,
  });
});
router.post("/create", staffController.createStaff);
router.get("/homepage", async (req, res) => {
  const staff = req.user;
  console.log("staff", staff);
  const foundEvaluation = await Evaluation.find({ staff: staff.fullname });
  return res.render("staff/homepage", {
    staff: staff,
    evaluation: foundEvaluation,
    hasEva: foundEvaluation.length > 0,
  });
});
router.post(
  "/login",
  passport.authenticate("staff.login", {
    failureRedirect: "/staff",
    failureFlash: true,
    successRedirect: "/staff/homepage",
  })
);
module.exports = router;
