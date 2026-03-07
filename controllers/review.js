const Listing=require("../DBModels/listing");
module.exports.createReview=async (req,res)=>
    {
      let {id}=req.params;
      let listing=await Listing.findById(id);
      let newReview=new Reviews(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("success"," New review is created");
      res.redirect(`/listings/${id}`);
    
    }
    module.exports.deleteReview=async(req,res)=>
      {
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
        await Reviews.findByIdAndDelete(reviewId);
        req.flash("success","Review is deleted");
         res.redirect(`/listings/${id}`);
      }