const express = require("express");
const router = express.Router();
const Quiz = require("../schemas/Quiz");

const User = require("../schemas/user");


// get details about quizes from the user Schema 
router.get ("/dashboard/:id",async(req,res,next)=>{
  try{
   const userId = req.params.id; 
   const user = await User.findById(userId).select("totalQuizes totalQuestions totalImpressions");
   res.status(200).json(user);
  }catch(error){
    next(error)
  }
});
//Questions from Quiz id
router.get("/question/:id",async(req,res,next)=>{
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
//get all the quizzes for trending section 
router.get("/trending", async (req, res, next) => {
  try {
    const data = await Quiz.find({ impression: { $gt: 10 } }).select("name createdOn impression");
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});
// get all quiz created by the user 
router.get("/analytics/:id",async(req,res,next)=>{
    const userId = req.params.id;
    try{
        const data = await Quiz.find({user:userId}).select("name createdOn impression").sort({name:1}); 
        res.status(200).json(data)
    }catch(err){
        res.status(404).json({message:"Not found"})
    }
});

//delete the quiz 
router.delete("/delete/:id",async(req,res,next)=>{
    const QuizId = req.params.id;
    try{
        const quiz = await Quiz.findById(QuizId).select("user questions");
        if(!quiz){
          return res.status(403).send("Wrong request"); 
        }
        const userId = quiz.user;    
        const questions = quiz.questions.length;
        await Quiz.findByIdAndDelete(QuizId);
        const user = await User.findById(userId)
        user.totalQuizes= user.quizId.length-1; 
        user.totalQuestions = user.totalQuestions-questions;
        const index = user.quizId.indexOf(QuizId);    
        if (index > -1) { 
          user.quizId.splice(index, 1); 
        }
        await user.save()
        res.status(200).send("Quiz deleted") ;
    }catch(err){
         next (err);
    }
})
//create Quiz
router.post("/create",async (req, res) => {
  try {
   
      const { name, type, user, questions } = req.body;      
      const userData = await User.findById(user)
      if(!userData){
           return res.status(401).json({message: 'User Not Found'})
       }
     
      if (!Array.isArray(questions) || questions.length === 0 ) {
          console.log('Invalid or empty questions array:', questions);
          return res.status(400).json({ message: 'Questions array is empty or invalid' });
      }
  
      // Create the current date string for the createdOn field
      const date = new Date();
      const currentDate = date.getDate();
      const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      const createdOn = `${currentDate} ${month[date.getMonth()]} ${date.getFullYear()}`;
    const quizDoc = new Quiz({
      name,
      type,
      user,
      questions,
      createdOn,
    });
    await quizDoc.save();
    console.log('Quiz saved successfully');
    // Update the user's quiz information
    userData.quizId.push(quizDoc._id);
    userData.totalQuizes = userData.quizId.length;
    userData.totalQuestions = userData.totalQuestions+quizDoc.questions.length ;
    console.log(userData.totalQuestions);
    
    await userData.save();
    res.status(201).json({ message: "Quiz Added", quizId:quizDoc._id});
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.put("/update/:quizId", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { name, type, user, questions } = req.body; 
    
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is empty or invalid" });
    }

    quiz.questions = questions.map((q) => ({
      questionText: q.questionText ,
      optionType: q.optionType,
      options: q.options.map((opt) => ({
        text: opt.text,
        imageUrl: opt.imageUrl || '', 
        answer: opt.answer || false, 
        selectedCount: opt.selectedCount || 0 
      })),
      timer: q.timer || 0, 
      attempted: q.attempted || 0,
      correctCount: q.correctCount || 0,
      incorrectCount: q.incorrectCount || 0
    }));

    // Save the updated quiz
    await quiz.save();
    res.status(200).json({ message: "Quiz updated successfully", quizId: quiz._id });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;