const express = require("express");
const router = express.Router();
const Quiz = require("../schemas/Quiz.js");
const User = require("../schemas/User.js");


//fetch quiz for Quiz Page 
router.get("/get/:id",async(req,res,next)=>{
    try{
      const id = req.params.id
      if(!id){
        return res.status(403).send("Wrong request"); 
      }
      const data = await Quiz.findById(id);
      res.status(200).json(data)
    }
    catch(err){
      next()
    }
  })
//update the attempted
router.patch("/update/attempted/:id",async(req,res,next)=>{
  try{
    const id = req.params.id;
    const count= 1 
    if(!id){
      return res.status(403).send("Wrong request"); 
    }
    const data = await Quiz.findOneAndUpdate({"questions._id":id},{
      $inc: {"questions.$.attempted": count } 
    },{new:true})
    await data.save()
    res.status(200).json({message:"done"});
  }catch(err){
    next(err);
  }
}) 
// update impresssion in Quiz 
router.patch("/update/impression/:id",async(req,res,next)=>{
    try{
      const id = req.params.id;
      const count = 1
      if(!id){
        return res.status(403).send("Wrong request"); 
      }
      const updatedQuiz = await Quiz.findByIdAndUpdate(id,{ $inc: { impression: 1 } },  { new: true }  );
      const updateUser = await User.findByIdAndUpdate(updatedQuiz.user,{ $inc: { totalImpressions: 1 } },  { new: true })
      res.status(200).json({message:"done"});
    }catch(err){
      next(err);
    }
  })
  //Update selected count of the option 
  router.patch("/selectcount/:id",async(req,res,next)=>{
    try{
        const id = req.params.id;
        const count=1; 
        if(!id){
          return res.status(403).send("Wrong request"); 
        }
       const data = await Quiz.findOneAndUpdate({"questions.options._id":id},{
        $inc: { "questions.$[].options.$[opt].selectedCount": count } 
      },{arrayFilters: [{ "opt._id":id}],new:true})
      if(!data){
        return res.status(403).send("Wrong request"); 
      }
       res.status(200).json({message:"done"})
    }
    catch(err){
      next(err);
    }
  })
  //update correctselection 
  router.patch("/correctanswer/:id",async(req,res,next)=>{
    try{
        const id = req.params.id;
        const count=1; 
        if(!id){
          return res.status(403).send("Wrong request"); 
        }
       const data = await Quiz.findOneAndUpdate({"questions._id":id},{
        $inc: {"questions.$.correctCount": count } 
      },{new:true})
      if(!data){
        return res.status(403).send("Wrong request"); 
      }
       res.status(200).json({message:" correct answer"})
    }
    catch(err){
      next(err);
    }
  })
  //update Incorrectselection 
  router.patch("/incorrectanswer/:id",async(req,res,next)=>{
    try{
        const id = req.params.id;
        const count=1; 
        if(!id){
          return res.status(403).send("Wrong request"); 
        }
       const data = await Quiz.findOneAndUpdate({"questions._id":id},{
        $inc: {"questions.$.incorrectCount": count } 
      },{new:true})
      if(!data){
        return res.status(403).send("Wrong request"); 
      }
       res.status(200).json({message:" Wrong answer"})
    }
    catch(err){
      next(err);
    }
  })

module.exports = router;