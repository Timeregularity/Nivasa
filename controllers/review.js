const Listing=require("../DBModels/listing");
const Review = require("../DBModels/review");
const Booking = require("../DBModels/booking");
const ExpressError = require("../utils/expressErrors");
module.exports.createReview=async (req,res)=>
    {
      let {id}=req.params;
      let listing=await Listing.findById(id);
      const completedBooking = await Booking.findOne({ listing: id, customer: req.user._id, status: "completed" });
      if (!completedBooking) throw new ExpressError(403, "You can review this stay after a completed booking.");
      const existingReview = await Review.findOne({ booking: completedBooking._id });
      if (existingReview) throw new ExpressError(409, "You have already reviewed this completed stay.");
      let newReview=new Review(req.body.review);
      newReview.author = req.user._id;
      newReview.booking = completedBooking._id;
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success"," New review is created");
      res.redirect(`/listings/${id}`);
    
    }
module.exports.deleteReview=async(req,res)=>
      {
        let {id,reviewId}=req.params;
        const review = await Review.findById(reviewId);
        const listing = await Listing.findById(id);
        if (!review || !listing) throw new ExpressError(404, "Review not found.");
        const canDelete = review.author.equals(req.user._id) || listing.owner.equals(req.user._id);
        if (!canDelete) throw new ExpressError(403, "You cannot delete this review.");
        await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review is deleted");
         res.redirect(`/listings/${id}`);
      }
