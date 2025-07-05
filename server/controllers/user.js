const userSchema=require("../models/user")

async function userRegistration(req, res) {
    try {    
        const {email, password} = req.body;
    
        const regidetails = new userSchema({
            email,
            password
        });

        const saveRegiDetails = await regidetails.save();
        return res.status(201).json(saveRegiDetails);
    } catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Error at Registration", error: err.message });
    }
}

async function userLogin(req, res) {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const user=await userSchema.findOne({email});

        console.log(user);
        return res.status(200).json({ _id: user._id});
    } catch (err) {
        return res.status(400).json({ message: "Error while login details", error: err.message });
    }
}


module.exports={
    userRegistration,
    userLogin
}






async function readAssign(req, res) {
    try {
      let assignmentDetail;
      // Check if an id is provided (for example, as a query parameter)
      if (req.query.id) {
        // Find the project by its id
        assignmentDetail = await assignmentSchema.findById(req.query.id);
        if (!assignmentDetail) {
          return res.status(404).json({ message: "Assignment not found" });
        }
      } else {
        // No id provided, return all assignments
        assignmentDetail = await assignmentSchema.find({});
      }
      return res.status(200).json(assignmentDetail);
    } catch (err) {
      return res.status(400).json({
        message: "Error retrieving assignment data",
        error: err.message,
      });
    }
  }