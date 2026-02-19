const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema(
    {
     comment:
     {required:true,
      type:String,
      
     },
     rating:
     {required:true,
      type:Number,
      min:0,
      max:5
     },
     createdAt:{
        type:Date,
        default:Date.now(),
       }
    
    }
);
const review=mongoose.model("review",reviewSchema);
module.exports=review;