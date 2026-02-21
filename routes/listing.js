const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../validation.js");
const Listing=require("../DBModels/listing.js");
const ExpressError = require("../utils/expressErrors.js");
const flash=require("connect-flash");

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
 
 router.get("/new",(req,res)=>{
    res.render("listings/new");
 });
 
 router.post("/", validateSchema, wrapAsync(async (req,res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New listing is created");
    res.redirect("/listings");
 }));
 
 router.get("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
      req.flash("failure","Listing Does not exist");
      return res.redirect("/listings");  
    }
    else{
      res.render("listings/show",{listing});
    }
    
 }));
 
 router.get("/:id/edit", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
 }));
 
 router.put("/:id", validateSchema, wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","New listing is updated");
    res.redirect(`/listings/${id}`);
 }));
 
 router.delete("/:id", wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing is deleted!");
    res.redirect("/listings");
 }));
 
module.exports=router;