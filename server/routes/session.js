const express=require("express");
const router=express.Router();
const {createSession, deleteSession, updateSession, readSession, readSessionProj}=require("../controllers/session")

router.post("/add",createSession);
router.delete("/delete",deleteSession);
router.patch("/update",updateSession);
router.get("/read",readSession);  
router.get("/ses",readSessionProj); 

module.exports=router;
