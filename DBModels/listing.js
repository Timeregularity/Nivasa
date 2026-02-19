const { ref } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const review=require("./review");

const listingSchema=new Schema(
    {
     title:
     {
      type:String,
      required:true,
     },
     description:String,
     img:{
        type:String,
        required:true,
        default:"https://images.unsplash.com/photo-1713892086528-1149a142e386?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzJTIwYW5kJTIwcmVzb3J0c3xlbnwwfHwwfHx8MA%3D%3D",
        set:(v)=>v===""?"https://images.unsplash.com/photo-1713892086528-1149a142e386?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG90ZWxzJTIwYW5kJTIwcmVzb3J0c3xlbnwwfHwwfHx8MA%3D%3D":v,
       },
     price:Number,
     location:String,
     country:String,
     reviews:
     [
        {
         type:Schema.Types.ObjectId,
         ref:"review"   
        }
     ]
    }
);
//post middleware to delete reviews after deletion of listing
listingSchema.post("findOneAndDelete",async (listing)=>
{
   if(listing)
   {
      await review.deleteMany({_id:{$in:listing.reviews}});
   }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;