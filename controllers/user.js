const User=require("../DBModels/user");
module.exports.renderSignUp=(req,res)=>
    {
        res.render("users/signUp.ejs");
    };
module.exports.Login=async (req,res,next)=>
{try{
    let {username,password,email,role}=req.body;
    const newUser=new User({username,email,role: role === "owner" ? "owner" : "customer"});
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
};
module.exports.renderLogin=(req,res)=>
    {
        res.render("users/login.ejs");
    };
module.exports.redirectURL=(req, res) => {

        req.flash("success", "Welcome Back to Nivasa");
  
        const redirectURL = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl;
  
        res.redirect(redirectURL);
    }
module.exports.logOut=(req,res,next)=>
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
    }
    module.exports.renderprofile = (req,res) =>
        {
          if(!req.user){
            req.flash("error","You must login first!");
            return res.redirect("/login");
          }
        
          res.render("users/profile.ejs");
        };
