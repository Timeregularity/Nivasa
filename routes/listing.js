const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../validation.js");
const Listing=require("../DBModels/listing.js");
const ExpressError = require("../utils/expressErrors.js");
const flash=require("connect-flash");
const {isLoggedIn,isOwner,validateSchema}=require("../middlewares.js");
const listingControllers=require("../controllers/listing.js");
const multer=require("multer");
const upload=multer({dest:"uploads/"});




//Listing Route

router.get("/", wrapAsync(listingControllers.index));
router.get("/new",isLoggedIn,listingControllers.renderNewListing);
 //create route
 router.post("/",upload.single('listing[img]'),isLoggedIn,validateSchema, wrapAsync(listingControllers.createNewListing));
 //show route
 router.get("/:id", wrapAsync(listingControllers.showListing));
 //edit route
 router.get("/:id/edit",isLoggedIn, wrapAsync(listingControllers.editListing));
 //edit route
 router.put("/:id",isLoggedIn,isOwner,upload.single('listing[img]'), validateSchema, wrapAsync(listingControllers.editPostreq));
 //delete route
 router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingControllers.deleteListing));
 
module.exports=router;