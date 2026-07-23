const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../validation.js");
const Listing=require("../DBModels/listing.js");
const ExpressError = require("../utils/expressErrors.js");
const flash=require("connect-flash");
const {isLoggedIn,isOwner,validateSchema}=require("../middlewares.js");
const listingControllers=require("../controllers/listing.js");
const { showSearchResults } = require("../controllers/nlpSearch.js");
// pull just the storage object from cloud configuration
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
// multer expects an options object with a `storage` property
const upload = multer({ storage });



router.get("/", wrapAsync(listingControllers.index));

router.get("/new", isLoggedIn, listingControllers.renderNewListing);

// search route
router.get("/search", listingControllers.searchByCountry);

// AI converts a natural-language search into these safe query parameters.
router.get("/nlp-search", wrapAsync(showSearchResults));

// category filter
router.get("/category/:category", listingControllers.filterByCategory);

// create route
router.post(
  "/",
  upload.single("listing[img]"),
  isLoggedIn,
  validateSchema,
  wrapAsync(listingControllers.createNewListing)
);

// show route
router.get("/:id", wrapAsync(listingControllers.showListing));

// edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.editListing));

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[img]"),
  validateSchema,
  wrapAsync(listingControllers.editPostreq)
);

// delete
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));
module.exports=router;
