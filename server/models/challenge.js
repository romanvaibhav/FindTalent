const mongoose=require("mongoose")


const challengeSchema = new mongoose.Schema({
    challenges: [{
        url: { type: String },
        title:{type:String},
        score:{
            type:String,
            enum:['Not Attempted', 'Partial Solution', 'Completed', 'Outstanding'],
            default: 'Not Attempted' 
        },
        status: { 
            type: String, 
            enum: ['In-Progress', 'Completed','active'], 
            default: 'active' },
        code: { 
            file: { type: mongoose.Schema.Types.Mixed, default: {} }
        }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userSchema",
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InterviewSchema",
    }
});



const challengeDetailSchema=mongoose.model("challengeSchema",challengeSchema);
module.exports=challengeDetailSchema;