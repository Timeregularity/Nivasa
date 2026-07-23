const Listing=require("../DBModels/listing");
module.exports.index =async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listings/index",{allListing});
 }
module.exports.createNewListing=async (req,res)=>{
      const newListing = new Listing(req.body.listing);
      // attach the currently logged-in user as the owner
      if(req.user && req.user._id){
         newListing.owner = req.user._id;
      }
      if(req.file){
         newListing.img = {
            url: req.file.path,
            fileName: req.file.filename
         };
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
     let original_url = (typeof listing.img === 'string' ? listing.img : listing.img.url);
     original_url=original_url.replace("/upload","/upload/w_250"); 
     res.render("listings/edit",{listing,original_url});
  }
  module.exports.editPostreq=async(req,res)=>{
      let {id}=req.params;

      let updatedData = {...req.body.listing};
      if(req.file){
         updatedData.img = {
            url: req.file.path,
            fileName: req.file.filename
         };
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
 module.exports.filterByCategory = async (req, res) => {
   let { category } = req.params;

   const listings = await Listing.find({ category });

   res.render("listings/index", { allListing: listings });
};
module.exports.searchByCountry = async (req, res) => {
   const { country } = req.query;

   const listings = await Listing.find({
      $or: [
         { country: { $regex: country, $options: "i" } },
         { location: { $regex: country, $options: "i" } }
      ]
   });

   res.render("listings/index", { allListing: listings });
};
