const express=require("express");
const app=express();
const mongoose= require("mongoose");
const ejs=require("ejs");
const Listing=require("./DBModels/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressErrors.js");
const {listingSchema}=require("./validation.js");
const {reviewSchema}=require("./validation.js");
const Reviews=require("./DBModels/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);


const Mongo_URL="mongodb://127.0.0.1:27017/Nivasa";
async function main() {
  await mongoose.connect(Mongo_URL);
  console.log("Database Connected");
  
   
  }
  main();
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
  const validatereviewSchema=(req,res,next)=>
    {
      let {error}=reviewSchema.validate(req.body); 
      if(error)
      {
       throw new ExpressError(400,error);
      }
    }
app.get("/",async (req,res)=>
{  
   const allListing=await Listing.find({});
   res.render("listings/index",{allListing}); 
});
app.get("/listings",async (req,res)=>
  {
   const allListing=await Listing.find({});
   res.render("listings/listing",{allListing});
  });
  app.get("/listings/new",(req,res)=>
  {
 res.render("listings/new");
  });

//create route
  app.post("/listings",validateSchema, wrapAsync(async (req,res,next)=>
  {  
     
     const newListing=new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
   
    
   
  }));
  //show route
  app.get("/listings/:id",async(req,res)=>
{
let {id}=req.params;
const listing=await Listing.findById(id).populate("reviews");
res.render("listings/show",{listing});

});
//edit route
app.get("/listings/:id/edit",async (req,res)=>
{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
});
//update route
app.put("/listings/:id" ,validateSchema,async(req,res)=>
{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);

});
//delete route
app.delete("/listings/:id",async(req,res)=>
{
  let {id}=req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  console.log(`deleted listing ${deletedListing}`);
  res.redirect("/listings");
});
//reviews Route
app.post("/listings/:id/reviews",async (req,res)=>
{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  let newReview=new Reviews(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${id}`);

});
//review delete route

app.delete("/listings/:id/reviews/:reviewId",
  wrapAsync(async(req,res)=>
  {
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}});
    await Reviews.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
  }
));
{

}
app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));

});

app.use((err,req,res,next)=>{
  let { statusCode = 500, message = "Something went wrong" } = err;
  
  res.status(statusCode).render("listings/error.ejs",{message});
});


app.listen(1000,(req,res)=>
{
    console.log("Server is listening at port 1000");
});

