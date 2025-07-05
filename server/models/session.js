const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema({
  interviewerId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userSchema',
    required: true },
  candidateName: { 
    type: String, 
    required: true },
  status: { 
    type: String, 
    enum: ['In-Progress', 'Completed','active'], 
    default: 'active' },
  createdAt: { type: Date, default: Date.now },
  score:{
    type:String,
    enum:['Not Attempted', 'Partial Solution', 'Completed', 'Outstanding'],
    default: 'Not Attempted' 
  },
  time_duration:{
    type:String,
    default:null
  },
  submit:{
    type:String,
    enum: ['true','false'], 
    default:false
  }
});

 const InterviewSchema= mongoose.model('InterviewSession', InterviewSessionSchema);
 module.exports=InterviewSchema;
