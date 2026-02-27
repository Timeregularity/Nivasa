const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../validation.js");
const Listing=require("../DBModels/listing.js");
const ExpressError = require("../utils/expressErrors.js");
const flash=require("connect-flash");
const {isLoggedIn,isOwner}=require("../middlewares.js");

const validateSchema=(req,res,next)=>
  {
    let {error}=listingSchema.validate(req.body); 
    if(error)
    {
     throw new ExpressError(400,error);
    }
    else
    {
      next();
    }
  }


//Listing Route

router.get("/", wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/listing",{allListing});
 }));
 
 router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new");
 });
 //create route
 router.post("/",isLoggedIn, validateSchema, wrapAsync(async (req,res)=>{
      const newListing = new Listing(req.body.listing);
      // attach the currently logged-in user as the owner
      if(req.user && req.user._id){
         newListing.owner = req.user._id;
      }
      await newListing.save();
    req.flash("success","New listing is created");
    res.redirect("/listings");
 }));
 //show route
 router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
      req.flash("error","Listing Does not exist");
      return res.redirect("/listings");  
    }
    else{
      res.render("listings/show",{listing});
    }
    
 }));
 
 
 router.get("/:id/edit",isLoggedIn, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
 }));
 //edit route
 router.put("/:id",isLoggedIn,isOwner, validateSchema, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","New listing is updated");
    res.redirect(`/listings/${id}`);
 }));
 //delete route
 router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted!");
    res.redirect("/listings");
 }));
 
module.exports=router;