const express=require("express");
const router=express.Router();
const User=require("../DBModels/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { isLoggedIn } = require("../middlewares.js");
const {saveRedirectUrl}=require("../middlewares.js");
const userControllers=require("../controllers/user.js")

router.get("/signUp",userControllers.renderSignUp);

router.post("/signUp", wrapAsync(userControllers.Login));
router.get("/login",userControllers.renderLogin);
router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}),userControllers.redirectURL);

router.get("/logout",userControllers.logOut);
router.get("/profile",userControllers.renderprofile);

module.exports=router;