const express=require("express");
const router=express.Router();
const {createAssign, deleteAssign, updateAssign, readAssign, readProject}=require("../controllers/assignment");


router.post("/add",createAssign);
router.delete("/delete",deleteAssign);
router.patch("/update/:id",updateAssign);
router.get("/read",readAssign);  
router.get("/proj",readProject); 


module.exports=router;
