const InterviewSchema=require("../models/session");
async function createSession(req,res){
    const {score, status, candidateName, interviewerId,time_duration,submit}=req.body;
    try{
        const sessionRegi= new InterviewSchema({
            candidateName,
            interviewerId,
            time_duration,
            status,
            score,
            submit
        });
        const sessionDetail=await sessionRegi.save();
        const sessionDetails=await InterviewSchema.find({});
        return res.status(200).json(sessionDetails);
    }
    catch(err){
        return res.status(400).json({message:"Error at Creating Session", error: err.message });
    }
}

async function deleteSession(req,res){
    try{
        const {id}=req.query;
        console.log(id);
        const employee=await InterviewSchema.deleteOne({_id:id});
        const sessionDetails=await InterviewSchema.find({});
        return res.status(200).json(sessionDetails);
    }
    catch(err){
        return res.status(400).status({message:"Getting error while deleting session",error:err.message});
    }
}

async function updateSession(req, res) {
    const { candidateName, status, score, time_duration,submit } = req.body; 
    try {
        const { id } = req.query;
        console.log("I Got the Id",id);
        const existingSession = await InterviewSchema.findById(id);
        if (!existingSession) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        // Update only the provided fields
        const updatedAssignment = await InterviewSchema.findByIdAndUpdate(
            id,
            {
                ...(candidateName !== undefined && { candidateName }),
                ...(status !== undefined && { status }),
                ...(score !== undefined && { score }),
                ...(time_duration !== undefined && { time_duration }),
                ...(submit !== undefined && {submit})
                },
            { new: true }
        );
        const sessionDetails=await InterviewSchema.find({});

        return res.status(200).json(sessionDetails);
    } catch (err) {
        return res.status(400).json({ message: "Error updating assignment", error: err.message });
    }
}



async function readSession(req,res){
    try{
        let { page, limit, search, sortBy, sortOrder } = req.query;
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 50;

        const skip = (page - 1) * limit;

        let filter = {}; 

        if (search && search.trim() !== "") {
            filter = {
                name: { $regex: search, $options: "i" }
            };
        }

        let sort = {};  
        if (sortBy) {
            sort[sortBy] = sortOrder === "asc" ? -1 : 1;  
        } else {
            sort["date"] = 1; 
        }

        const employees = await InterviewSchema.find(filter)
            .collation({ locale: "en", strength: 2 })  
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalEmployees = await InterviewSchema.countDocuments(filter);

        res.status(200).json({
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: page,
            employees
        });
    }
    catch(err){
        return res.status(400).json({message:"Error at Adding Eployee Data", error: err.message });
    }
}

async function readSessionProj(req,res){
    try {
        let sessionDetail;
        if (req.query.id) {
          sessionDetail = await InterviewSchema.findById(req.query.id);
          if (!sessionDetail) {
            return res.status(404).json({ message: "Assignment not found" });
          }
        }
        return res.status(200).json(sessionDetail);
      } catch (err) {
        return res.status(400).json({
          message: "Error retrieving assignment data",
          error: err.message,
        });
      }
}


async function readSession(req, res) {
    try {
        let { page, limit, search, sortBy, sortOrder } = req.query;
        console.log(search);

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 50;
        const skip = (page - 1) * limit;

        let filter = {}; 

        // Apply search filter if search query is provided

        if (search && search.trim() !=="") {
            filter = {
                candidateName: { $regex: search, $options: "i" }
            };
        }

        let sort = {};  
        // Apply sorting if sortBy and sortOrder are provided
        if (sortBy=="createdAt") {
            sort["createdAt"] = -1;
        } else {
            // If sorting by a field other than createdAt, default to ascending order
            sort[sortBy] = sortOrder ? (sortOrder === "asc" ? 1 : -1) : 1;
        }

        // Query the database
        const employees = await InterviewSchema.find(filter)
        .collation({ locale: "en", strength: 2 })  
        .sort(sort)
        .skip(skip)
        .limit(limit);

        // Get the total number of documents matching the filter
        const totalEmployees = await InterviewSchema.countDocuments(filter);

        // Send the response
        res.status(200).json({
            totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
            currentPage: page,
            employees
        });
    } catch (err) {
        return res.status(400).json({ message: "Error at Adding Employee Data", error: err.message });
    }
}


async function readSessionProj(req,res){
    try {
        let sessionDetail;
        if (req.query.id) {
          sessionDetail = await InterviewSchema.findById(req.query.id);
          if (!sessionDetail) {
            return res.status(404).json({ message: "Assignment not found" });
          }
        }
        return res.status(200).json(sessionDetail);
      } catch (err) {
        return res.status(400).json({
          message: "Error retrieving assignment data",
          error: err.message,
        });
      }
}




module.exports={
    createSession,
    deleteSession,
    updateSession,
    readSession,
    readSessionProj
}