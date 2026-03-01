const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../DBModels/listing.js");
const ExpressError = require("../utils/expressErrors.js");
const {reviewSchema}=require("../validation.js");
const Reviews=require("../DBModels/review.js");
const {isLoggedIn}=require("../middlewares.js");



const validatereviewSchema=(req,res,next)=>
    {
      let {error}=reviewSchema.validate(req.body); 
      if(error)
      {
       throw new ExpressError(400,error);
      }
      next();
    }



//create
router.post("/",isLoggedIn,validatereviewSchema,async (req,res)=>
{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  let newReview=new Reviews(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success"," New review is created");
  res.redirect(`/listings/${id}`);

});
//review delete route

router.delete("/:reviewId",isLoggedIn,
  wrapAsync(async(req,res)=>
  {
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
     res.redirect(`/listings/${id}`);
  }
));
module.exports = router;