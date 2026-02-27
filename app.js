const express=require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./DBModels/listing.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/expressErrors.js");
const {listingSchema,reviewSchema}=require("./validation.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const methodOverride=require("method-override");
const session=require("express-session");
const flash=require("connect-flash");
const LocalStrategy=require("passport-local");
const User=require("./DBModels/user.js");
const passport=require("passport");


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

  const sessionOptions={
    secret:"23B0101088",
    resave:false,
    saveUninitialized:true,
    cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true
    }
  };

  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  


// use static serialize and deserialize of model for passport session support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  
 
  app.use((req,res,next)=>
  {
    res.locals.success=req.flash("success") || [];
    res.locals.error=req.flash("error") || [];
    res.locals.currentUser = req.user;
    next();
  });

 
  
 app.get("/demouser",async (req,res)=>
{
  let fakeUser=new User(
    {
      email:"abc@gmail.com",
      username:"Slam8m"
    });
  let registeredUser=await User.register(fakeUser,"helloworld");
  res.send(registeredUser);
})



 //router Listing
 app.use("/listings",listingRouter);
 
 //router review
 app.use("/listings/:id/reviews",reviewRouter);
 //user router
 app.use("/",userRouter);
 //current user
 //index route
 app.get("/", async (req,res)=>{
   const allListing = await Listing.find({});
   res.render("listings/index",{allListing});
 });
 

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

