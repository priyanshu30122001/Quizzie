import React, { useState,useEffect } from 'react'
import Sidebar from '../Sidebar';
import "./index.css";
import eye from "../../assets/images/eye.png"
import { dashboarData,trendingQuiz } from '../../apis/quiz';
import ClipLoader from "react-spinners/ClipLoader";
import MoonLoader from "react-spinners/MoonLoader";

function Dashboard() {
  const [loading,setLoading] = useState(true);
  const [quizes,setQuizes] = useState([]);
  const [Data,setData] = useState();

  const [userId, setUserId] = useState();

  const fetchDashboardData = async () => {
    if (!userId) return;
    try {
      const data = await dashboarData(userId);
      const quizData = await trendingQuiz();
      setQuizes(quizData);
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } 
  };
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
       console.error("No userId found in session storage");
    }
  }, []);

  useEffect(() => {
    if (userId) {
       fetchDashboardData();
    }
 },[userId]);

  return (
    <div className='dashboard-main'>
        <Sidebar button={"dashboard"}/>
        <div className='dashboard'>
           <div className='flex-box'>
              <div className='box one '>
                    <p><span className='quiz' >{!loading?Data.totalQuizes:<ClipLoader loading={loading} color={"#45dabc"}/>}</span>Quiz</p>
                    <p>Created</p>
              </div>
              <div className='box two' >
                    <p ><span className='question' >{!loading?Data.totalQuestions:<ClipLoader loading={loading} color={"#45dabc"}/>}</span>Questions</p>
                    <p className='align'>Created</p>
              </div>
              <div className='box three' >
                    <p><span className='impression'>{!loading?Data.totalImpressions:<ClipLoader loading={loading} color={"#45dabc"}/>}</span>Total</p>
                    <p>Impressions</p>
              </div> 
           </div>
           <div className='trending'>
            <h1 >Trending Quizs</h1>
            {!loading?
               <div className='trending-grid'>
                {quizes.map((data,index)=>{
                  return(
                      <div className='trendingquiz-container' key={index}>
                          <div><div className='text-wrap'>{data.name}</div><span>{data.impression} <img src={eye} alt="" /></span></div>
                          <p>created on : {data.createdOn}</p>
                      </div>
                  )})
                }
              </div>
              :
               <div style={{display:"flex",alignItems:"center" ,justifyContent:"center",width:"50vw",marginTop:"10vh"}}>
                  <MoonLoader loading={loading} color={"#45dabc"} />
               </div>
            }
           </div>
        </div>
    </div>
  )
}

export default Dashboard;
