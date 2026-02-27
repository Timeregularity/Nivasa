const express=require("express");
const router=express.Router();
const User=require("../DBModels/user");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { isLoggedIn } = require("../middlewares.js");
const {saveRedirectUrl}=require("../middlewares.js");

router.get("/signUp",(req,res)=>
{
    res.render("users/signUp.ejs");
});

router.post("/signUp", wrapAsync(async (req,res)=>
{try{
    let {username,password,email}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>
    {
      if(err)
      {
        return next(err);
      }
      req.flash("success","Welcome to NIVASA");
      res.redirect("/listings");
    });
   }
catch(e)
{
    req.flash("error",e.message);
    res.redirect("/signUp");
}
}));
router.get("/login",(req,res)=>
{
    res.render("users/login.ejs");
});
router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
  }),

  
  (req, res) => {

      req.flash("success", "Welcome Back to Nivasa");

      const redirectURL = res.locals.redirectUrl || "/listings";
      delete req.session.redirectUrl;

      res.redirect(redirectURL);
  }
);

router.get("/logout",(req,res)=>
{
  req.logOut((err)=>
  {
   if(err)
   {
    return next(err);
   }
   req.flash("success","succesfully logged out!");
   res.redirect("/listings");
  });
});
router.get("/profile",(req,res)=>
{
if(isLoggedIn)
{
  res.render("users/profile.ejs");
}
});

module.exports=router;