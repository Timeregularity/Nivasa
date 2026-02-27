const Listing = require("./DBModels/listing");

module.exports.isLoggedIn=(req,res,next)=>
{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged In");
        console.log(req.user);
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>
{
 if(req.session.redirectUrl)
 {
    res.locals.redirectUrl=req.session.redirectUrl;
    
 }
 next();
}
module.exports.isOwner=async (req,res,next)=>
{   let {id}=req.params;
    let list = await Listing.findById(id);
     if(req.user && !list.owner.equals(req.user._id))
        {
          req.flash("error","You are not the owner of this listing!");
          return res.redirect(`/listings/${id}`);
        }
        next();
}

