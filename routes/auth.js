const express=require('express');
const router=express.Router();
const Users=require('../models/Users');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const getuser=require('../middleware/getUser');
const mysign="imtg@ilimbsdcaiaaaiaowin";


// Sign up route:

router.post('/createuser',[
    body('name','Enter a valid name').isLength({min:3}),
    body('email','Invalid Email address').isEmail(),
    body('password','Password must be of atleast 6 characters').isLength({min:6})
], async(req,res)=>{
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,"Status":"Please try again!"});
    }
    try{
      let user = await Users.findOne({email:req.body.email});
      if(user){
        res.status(400).json({success,"Status":"Email already exists"});
        return;
      }
      const salt=await bcrypt.genSalt(10);
      const securedPass= await bcrypt.hash(req.body.password,salt);
    user = await Users.create({
        name: req.body.name,
        email: req.body.email,
        password:securedPass
      })
      const data={
        user:{
          id:user.id
        }
      }
      const token=jwt.sign(data,mysign)
      success=true;
      res.json({success,token,"Status":"Yay! Welcome to Noteflix"});
    }
    catch(error){
      console.error(error.message)
      res.status(500).json({"success":false,"Status":"Server error!"})
    }
})

//Login Route:

router.post('/login',[
  body('email','Invalid Email address').isEmail(),
  body('password','Password cannot be blank').exists()
], async(req,res)=>{
  let success=false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, "Status":"Please try again!"});
  }
  const {email,password}=req.body;
  try{
    let user = await Users.findOne({email});
    if(!user){
      return res.status(400).json({success,"Status":"Please enter correct email id and password"});
    }
    const compPassword= await bcrypt.compare(password,user.password);
    if(!compPassword){
      return res.status(400).json({success,"Status":"Please enter correct email id and password"});
    }
    const data={
      user:{
        id:user.id
      }
    }
    const token=jwt.sign(data,mysign)
    success=true;
    res.json({success,token,"Status":"Welcome Back "+user.name});
  }
  catch(error){
    console.error(error.message)
    res.status(500).json({"success":false,"Status":"Server error!"})
  }
})

// User detials route:
router.post('/getuser',getuser, 
async(req,res)=>{
  try{
    let success=true;
    const userId=req.user.id;
    const user= await Users.findById(userId).select("-password");
    res.json({success,user});
  }
  catch(error){
    console.error(error.message)
    res.status(500).json({"success":false,"Status":"Server error!"})
  }
})


module.exports=router;