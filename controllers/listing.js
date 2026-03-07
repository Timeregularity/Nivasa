const Listing=require("../DBModels/listing");
module.exports.index =async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/listing",{allListing});
 }
module.exports.createNewListing=async (req,res)=>{
      const newListing = new Listing(req.body.listing);
      // attach the currently logged-in user as the owner
      if(req.user && req.user._id){
         newListing.owner = req.user._id;
      }
      if(req.file){
         newListing.img = req.file.path;
      }
      await newListing.save();
    req.flash("success","New listing is created");
    res.redirect("/listings");
 }
 module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing) {
      req.flash("error","Listing Does not exist");
      return res.redirect("/listings");  
    }
    else{
      res.render("listings/show",{listing});
    }
    
 }
 module.exports.editListing=async(req,res)=>{
     let {id}=req.params;
     const listing = await Listing.findById(id);
     res.render("listings/edit",{listing});
  }
  module.exports.editPostreq=async(req,res)=>{
      let {id}=req.params;
      let updatedData = {...req.body.listing};
      if(req.file){
         updatedData.img = req.file.path;
      }
      await Listing.findByIdAndUpdate(id, updatedData);
      req.flash("success","New listing is updated");
      res.redirect(`/listings/${id}`);
   }
   module.exports.deleteListing=async(req,res)=>{
       let {id}=req.params;
       await Listing.findByIdAndDelete(id);
       req.flash("success","listing is deleted!");
       res.redirect("/listings");
    }
    module.exports.renderNewListing=(req,res)=>{
    res.render("listings/new");
 };