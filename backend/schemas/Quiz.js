const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const options = new mongoose.Schema({
    text:{
      type:String,
    },
    answer:{
      type:Boolean,
      default:false
    },
    imageUrl:{ 
      type:String, 
    },
    selectedCount: { 
          type: Number, 
          default: 0 
      }
  });
  
  const Question = new mongoose.Schema({
    questionText:{
      type:String,
      required:true
    },
    optionType:{
      type:String,
      enum:["Text","Image URL","Text & Image URL"],
      required:true
    },
    options:[options],
    timer:{ 
      type: Number, 
      default: 0 
    },
    attempted:{
      type:Number,
      default:0
    },
    correctCount: { 
      type: Number, 
      default: 0 
    },
    incorrectCount: { 
      type: Number, 
      default: 0 
    },
  });
  
const quizSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    createdOn:{
       type:String,
       required:true
    },
    questions:{
        type:[Question],
        default:[]
    },
    impression:{
        type:Number,
        default:0
    },
    user:{
        type:Schema.Types.ObjectId, 
        ref:'User' 
    }
});

module.exports = mongoose.model("Quiz",quizSchema)