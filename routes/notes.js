const express=require('express');
const router=express.Router();
const Notes=require('../models/Notes');
const { body, validationResult } = require('express-validator');
const getUser=require('../middleware/getUser');

// Get Notes Route:

router.get('/getnotes',getUser,
async(req,res)=>{
    try{
    const notes= await Notes.find({user:req.user.id});
    res.json(notes);
    }
    catch(error){
        console.error(error.message)
        res.status(500).send("Server error!")
      }
})

// Post Notes Route:
router.post('/addnote',getUser,[
    body('title','Title is too short!').isLength({min:3}),
    body('description','Description is too short!').isLength({min:3})
],
async(req,res)=>{
    const {title,description,tag}=req.body;
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors: errors.array() });
    }
    try{
    const note=new Notes({
        title,description,tag, user:req.user.id
    })
    const savedNotes = await note.save();
    success=true;
    res.json({success,savedNotes,"Status":"Note has been addded successfully!"});
}
catch(error){
    console.error(error.message)
    res.status(500).json({"success":false,"Status":"Server Error! Try again"});
  }
})

// Update Note Route:

router.put('/updatenote/:id',getUser,
async(req,res)=>{
    const {title,description,tag}=req.body;
    let success=false;
    try{
    let note= await Notes.findById(req.params.id);
    if(!note)return res.status(404).json({success,"Status":"Not Found"});
    if(note.user.toString()!==req.user.id)return res.status(401).json({success,"Status":"Not Allowed"});
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    success=true;
    res.json(success,note);
    }
    catch(error){
        console.error(error.message)
        res.status(500).json({"success":false,"Status":"Server error!"})
      }
})

// Delete Note Route:

router.delete('/deletenote/:id',getUser,
async(req,res)=>{
  let success=false;
    try{
    let note= await Notes.findById(req.params.id);
    if(!note)return res.status(404).json({success,"Status":"Note is not found"});
    if(note.user.toString()!==req.user.id)return res.status(401).json({success,"Status":"You are not authorised to delete this Note"});
    note.remove();
    success=true;
    res.json({success,"Status":"Note has been deleted succesfully"});
    }
    catch(error){
        console.error(error.message)
        res.status(500).send({"success":false,"Status":"Server error!"})
      }
})


module.exports=router;