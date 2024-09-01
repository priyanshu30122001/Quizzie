import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const loginUser =async(email,password)=>{
    try{
        const reqUrl =`${backendUrl}/auth/login`;
        const response = await axios.post(reqUrl,{email:email,password:password});
        console.log(response.data);
        return response.data;
         
    }
  catch(err){
     console.log(err);
  }
}
export const signupUser =async({name,email,mobile,password,})=>{
    try{ 
        const reqUrl =`${backendUrl}/auth/register`;
        const response = await axios.post(reqUrl,{name,email,mobile,password});
        // console.log();
        return response.data;
    }
  catch(err){
     console.log(err);
     return err.response.data;
  }
}