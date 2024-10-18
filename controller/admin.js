const Admin = require("../model/admin");
const evaluation = require("../model/evaluation");
const Evaluation = require("../model/evaluation");
const argon = require("argon2");
const createAdmin = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    let hashPassword = await argon.hash(password);
    const newAdmin = await Admin.create({
      email,
      password: hashPassword,
      fullname,
    });
    if (!newAdmin) {
      return res.json({
        msg: "something went wrong",
        admin: newAdmin,
      });
    }
    return res.json({
      msg: "account created succesfully",
      admin: newAdmin,
    });
  } catch (err) {
    return res.json({
      msg: "something went wrong",
      errMsg: err.message,
    });
  }
};
const createEvaluation = async (req, res) => {
  let errMsg = [];
  let successMsg = [];
  try {
    const { critaria, score, week, semester, session, status, staff } =
      req.body;
    const newEvaluation = await Evaluation.create({
      critaria,
      score,
      week,
      semester,
      session,
      status,
      staff,
      evaluator: req.user.fullname,
    });
    if (!newEvaluation) {
      let message = "something went wrong coundnt create evaluation";
      errMsg.push(message);
      req.flash("error", errMsg);
      return res.redirect("/admin/createevaluation");
    }
    let message = "evaluation created successfuly";
    successMsg.push(message);
    req.flash("success", successMsg);
    res.redirect("/admin/createevaluation");
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/admin/createevaluation");
  }
};
const staffEvaluation = async (req, res) => {
  const staff = req.params.fullname;
  const foundEvalution = await Evaluation.find({ staff });
  return res.render("admin/staffsingle", {
    evaluation: foundEvalution,
  });
};
const isAdmin = async (req, res, next) => {
  const errMsg = [];
  try {
    const currentUser = req.user;
    const foundAdmin = await Admin.findOne({ _id: currentUser._id });
    if (!foundAdmin) {
      let message = "account if not an admin/evaluator";
      errMsg.push(message);
      req.flash("error", errMsg);
      return res.redirect("/admin/");
    }
    return next();
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/admin/");
  }
};
module.exports = {
  createAdmin,
  createEvaluation,
  staffEvaluation,
  isAdmin,
};
