const express=require("express");
const router=express.Router();
const {userRegistration, userLogin}=require("../controllers/user")

router.post("/register",userRegistration);
router.post("/login",userLogin);


module.exports=router;
