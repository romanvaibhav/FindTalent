const challengeDetailSchema=require("../models/challenge");
const mongoose = require("mongoose"); 
async function addChallenge(req, res) {
    const { challenges, userId, candidateId, code } = req.body;

    try {
        let challengeRegi = await challengeDetailSchema.findOne({ candidateId });

        if (!challengeRegi) {
            // If no document exists, create a new one
            challengeRegi = new challengeDetailSchema({
                challenges: challenges.map(({ url, title, score, status, code }) => ({ url, title, score,status, code })),  // Store both url and title
                userId,
                candidateId,
                code
            });
        } else {
            challenges.forEach(({ url, title }) => challengeRegi.challenges.push({ url, title }));
        }
        await challengeRegi.save();

        // Fetch and return the updated challenge details
        return res.status(200).json(challengeRegi);
    } catch (err) {
        return res.status(400).json({ message: "Error at Adding Challenge", error: err.message });
    }
}






async function deleteChallenge(req, res) {
    try {
        const { id, candidateId } = req.query; // Get challenge ID & candidate ID

        if (!id || !candidateId) {
            return res.status(400).json({ message: "Missing challengeId or candidateId" });
        }

        // Find the document & remove the specific challenge from the array
        const updatedChallenge = await challengeDetailSchema.findOneAndUpdate(
            { candidateId },
            { $pull: { challenges: { _id: id } } },  // Remove challenge by ID
            { new: true } // Return the updated document
        );

        if (!updatedChallenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        return res.status(200).json(updatedChallenge);
    } catch (err) {
        return res.status(400).json({ message: "Error deleting challenge", error: err.message });
    }
}


async function readAChallengen(req,res){
    try{
        const {id}=req.query;
        console.log(id);
        const challengeDetail=await challengeDetailSchema.find({candidateId:id});
        console.log("Sending Challenges");
        return res.status(200).json(challengeDetail);
    }
    catch(err){
        return res.status(400).json({message:"Error at Adding Eployee Data", error: err.message });
    }
}

async function getChallengeByChallengeId(req, res){
    const { challengeId } = req.query;
    console.log(challengeId);
  
    try {
      // Using the positional operator to return only the matching challenge element.
      const candidate = await challengeDetailSchema.findOne(
        { 'challenges._id': challengeId },
        { 'challenges.$': 1 }
      );
      console.log(candidate);
      
    //   if (!challengeDetailSchema || !challengeDetailSchema.challenges || challengeDetailSchema.challenges.length === 0) {
    //     return res.status(404).json({ error: 'Challenge not found' });
    //   }
      
      // Return the matched challenge from the challenges array
      return res.status(200).json(candidate);
    } catch (error) {
      console.error('Error retrieving challenge:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };


  
  async function patchChallengeById(req, res) {
    const { challengeId } = req.query; // challengeId from the query params
    const { score, status ,code } = req.body; // score and status from the body of the request
  
    console.log("ChallengeId for Patch Req", challengeId);
  
    try {
      let updateFields = {};
  
      if (score) {
        updateFields['challenges.$.score'] = score; // Add score update if provided
      }
      if (status) {
        updateFields['challenges.$.status'] = status; // Add status update if provided
      }
      if (code) {
        console.log(code);
        updateFields['challenges.$.code.file'] = code.file; // Add status update if provided
      }
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update' });
      }
  
      // Update the challenge in the challenges array that matches the challengeId
      const updatedChallenge = await challengeDetailSchema.findOneAndUpdate(
        {
          'challenges._id': challengeId, // match challenge by challengeId
        },
        {
          $set: updateFields, // Only set the fields that were provided
        },
        { new: true } // This option returns the updated document
      );
      if (!updatedChallenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      res.status(200).json({
        message: 'Challenge updated successfully',
        data: updatedChallenge,
      });
    } catch (error) {
      console.error('Error while updating challenge:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
  
  
  


module.exports={
    readAChallengen,
    deleteChallenge,
    addChallenge,
    getChallengeByChallengeId,
    patchChallengeById
}