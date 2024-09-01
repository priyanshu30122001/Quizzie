const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    totalQuizes: { 
        type: Number, 
        default: 0 
    },
    totalQuestions: { 
        type: Number, 
        default: 0 
    },
    totalImpressions: { 
        type: Number, 
        default: 0 
    },
    quizId: [
        {
            type:Schema.Types.ObjectId,
            ref:'Quiz'
        }
    ],
    questionId: [
        {
            type:Schema.Types.ObjectId,
            ref:'Question'
        }
    ],

})

module.exports = mongoose.model("User",userSchema);