const Staff = require("../model/staff");
const argon = require("argon2");

const createStaff = async (req, res) => {
  let errMsg = [];
  let successMsg = [];
  try {
    const { fullname, email, password } = req.body;
    let hashPassword = await argon.hash(password);
    const newStaff = await Staff.create({
      fullname,
      email,
      password: hashPassword,
    });
    if (!newStaff) {
      let message = "something went wrong";
      errMsg.push(message);
      req.flash("error", errMsg);
      return res.redirect("/admin/createstaff");
    }
    let message = "account created successfuly";
    let newStaffName = newStaff.fullname;
    let newStaffEmail = newStaff.email;
    successMsg.push(message);
    req.flash("success", successMsg);
    return res.redirect("/admin/createstaff");
  } catch (err) {
    let message = err.message;
    errMsg.push(message);
    req.flash("error", errMsg);
    return res.redirect("/admin/createstaff");
  }
};
const isLoggedin = async (req, res, next) => {
  let errMsg = [];
  try {
    const currentUser = req.user;
    const foundStaff = await Staff.findOne({ _id: currentUser._id });
    if (!foundStaff) {
      let message = "you must be logged in to access this route";
      errMsg.push(message);
      req.flash("error", errMsg);
      return res.redirect("/staff/");
    }
    return next();
  } catch (err) {
    errMsg.push(err.message);
    req.flash("error", errMsg);
    return res.redirect("/staff/");
  }
};
module.exports = {
  createStaff,
  isLoggedin,
};
