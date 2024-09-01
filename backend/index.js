const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRouter = require("./routes/authRoute");
const quizRouter = require("./routes/quizRoute");
const quizUpdateRouter = require("./routes/quizUpdateRouter");
const bodyParser = require("body-parser");
const cors = require("cors");
const authMiddleware = require("./middleware/index");

const port = 4000
app.use(cors({
    origin:"*",  
}));
// app.use(bodyParser.json());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/auth",authRouter);
app.use("/auth/quiz",authMiddleware,quizRouter);
app.use("/quiz",quizUpdateRouter)

app.get("/",(req,res)=>{
    res.send("hello world");
});

app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}/`);
    mongoose.connect("mongodb+srv://priyanshupadeliya27:core.123456789@user.pvoe7vt.mongodb.net/?retryWrites=true&w=majority&appName=User");
    mongoose.connection.on("connected",()=>{
    console.log("connected to mongoDB");
    })
});