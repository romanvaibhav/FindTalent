const mongoose=require("mongoose");

const userSchemaDetail=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique: true,
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    password:{
        type:String,
        required:true,
    }
});

const userSchema=mongoose.model("userSchema",userSchemaDetail);
module.exports=userSchema;