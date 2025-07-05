const express=require("express");
const router=express.Router();
const {addChallenge, deleteChallenge, readAChallengen, getChallengeByChallengeId, patchChallengeById}=require("../controllers/challenge");


router.post("/add",addChallenge);
router.delete("/delete",deleteChallenge);
router.get("/read",readAChallengen);  
router.get("/readone",getChallengeByChallengeId);
router.patch("/update",patchChallengeById);

module.exports=router;