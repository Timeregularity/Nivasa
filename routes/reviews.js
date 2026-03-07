const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../DBModels/listing.js");
const ExpressError = require("../utils/expressErrors.js");
const {reviewSchema}=require("../validation.js");
const Reviews=require("../DBModels/review.js");
const {isLoggedIn,validateReview}=require("../middlewares.js");
const reviewControllers=require("../controllers/review.js")
//create
router.post("/",isLoggedIn,validateReview,reviewControllers.createReview);
//review delete route

router.delete("/:reviewId",isLoggedIn,wrapAsync(reviewControllers.deleteReview));
module.exports = router;