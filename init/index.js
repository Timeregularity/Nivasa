 const mongoose=require("mongoose");
 const Listing=require("../DBModels/listing.js");
 const initData=require("./data.js");

 const Mongo_URL="mongodb://127.0.0.1:27017/Nivasa";
 async function main() {
     await mongoose.connect(Mongo_URL);
     
   
    
   }
   main().then(()=>
{
    console.log("Database Connected");
})
.catch((err)=>
{
console.log(err);
});
const initDB=async()=>
 {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized!");
 }
 initDB();