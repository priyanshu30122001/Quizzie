import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('token');

export const dashboarData =async(userId)=>{
    
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/auth/quiz/dashboard/${userId}`;
        const response = await axios.get(reqUrl,config);
        return response.data;
    }
  catch(err){
     console.log(err);
  }
}

export const trendingQuiz = async()=>{
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/auth/quiz/trending`;
        const response = await axios.get(reqUrl,config);
        return response.data;
    }catch(err){
       console.log(err);
        
    }
}
export const getQuizForAnalysis =async(id)=>{
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/auth/quiz/question/${id}`;
        console.log(reqUrl);
        
        const response = await axios.get(reqUrl,config);
        return response.data;
    }catch(err){
        console.log(err);   
     }
}
 
export const getQuiz =async(id)=>{
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/quiz/get/${id}`;
        const response = await axios.get(reqUrl,config);
        return response.data;
    }catch(err){
        console.log(err);   
     }
}
export const quizForAnalytics = async(user)=>{
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/auth/quiz/analytics/${user}`;
        const response = await axios.get(reqUrl,config);
        return response.data;
    }
    catch(Err){
       console.log(Err);
       
    }
}

export const deleteQuiz = async(deleteId)=>{
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/auth/quiz/delete/${deleteId}`;
        const response = await axios.delete(reqUrl,config);
        return response.data;
    }
    catch(Err){
       console.log(Err);
       
    }
}

export const makeQuiz = async({name,user,type,questions})=>{
    try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
        const reqUrl =`${backendUrl}/auth/quiz/create`;
        const response = await axios.post(reqUrl,{name,user,type,questions},config);
        return response.data
        
    }catch(err){
        alert(err);
    }

}
export const updateQuiz = async({name,user,type,questions,},quizId)=>{
     try{
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
         };
         console.log(questions);
         
         const reqUrl =`${backendUrl}/auth/quiz/update/${quizId}`;
         const response = await axios.put(reqUrl,{name,user,type,questions,},config);
         return response.data
     }
     catch(err){
        alert(err);
     }
} 

