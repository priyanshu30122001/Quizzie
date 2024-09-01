const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const User = require("../schemas/user");

// Auth Middleware 

const authMiddleware = async(req,res,next)=>{
    try  {
        const token = req.header('Authorization').split(' ')[1]; 
        if(token){
            const verfied = jwt.verify(token,process.env.JWT_SECRET);
            if (verfied){
                const user = await User.findOne({_id:verfied._id})
                
                if(user){
                    req.user = user;
                    next();
                }
                else{
                    res.status(401).send("Access Denied");
                }
            }
            else{
                res.status(401).send("Access Denied");
            }
        }
        else{
            res.status(401).send("Access Denied");
        }
    }
    catch(error){
        next(error);
    }
}

module.exports = authMiddleware;