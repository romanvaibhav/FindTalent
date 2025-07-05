const mongoose=require("mongoose")


const assignmentSessionSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    skills:{
        type:[String],
        required:true,
    },
    StackBlitzUrl:{
        type:String,
        required:true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"userSchema",
        required:true,
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});


const assignmentSchema=mongoose.model("assignmentSchema",assignmentSessionSchema);
module.exports=assignmentSchema;