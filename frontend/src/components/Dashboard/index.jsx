import React, { useState,useEffect } from 'react'
import Sidebar from '../Sidebar';
import "./index.css";
import eye from "../../assets/images/eye.png"
import { dashboarData,trendingQuiz } from '../../apis/quiz';
function Dashboard() {
  const [quizes,setquizes]= useState([]);
  const [Data,setData] = useState({
    totalQuizes:0,
    totalQuestions:0,
    totalImpressions:0
  });
  const userId = localStorage.getItem("userId");
  const fetchDashboardData =async()=>{
    const data = await dashboarData(userId);
    const quizData = await trendingQuiz();
    setquizes(quizData)
    setData(data)
  }
  // setInterval(fetchDashboardData,5000)
  useEffect(()=>{
    fetchDashboardData();
  },[]);

  return (
    <div className='dashboard-main'>
        <Sidebar button={"dashboard"}/>
        <div className='dashboard'>
           <div className='flex-box'>
              <div className='box one '>
                    <p><span className='quiz' >{Data.totalQuizes}</span>Quiz</p>
                    <p>Created</p>
              </div>
              <div className='box two' >
                    <p className='align'><span className='question' >{Data.totalQuestions}</span>Questions</p>
                    <p className='align'>Created</p>
              </div>
              <div className='box three' >
                    <p><span className='impression'>{Data.totalImpressions}</span>Total</p>
                    <p>Impressions</p>
              </div> 
           </div>
           <div className='trending'>
            <h1 >Trending Quizs</h1>
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
           </div>
        </div>
    </div>
  )
}

export default Dashboard;