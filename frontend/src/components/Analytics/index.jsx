import React, { useEffect } from 'react'
import Sidebar from '../Sidebar';
import { useState } from 'react';
import './index.css';
import deleteIcon from "../../assets/images/delete.png";
import share from "../../assets/images/share.png";
import edit from "../../assets/images/edit.png"
import{quizForAnalytics,deleteQuiz} from "../../apis/quiz";
import BeatLoader from "react-spinners/BeatLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


function Analytics() {
  const navigate = useNavigate()
  const [quizes,setquizes]= useState(["No Data"]);
  const [loading,setloading]=useState(true);
  const [confirm,setconfirm]=useState(false);
  const userId = localStorage.getItem("userId");
  const [deleteId,setdeleteId]=useState("");
  const notify = () => toast.success("Link copied to Clipboard",{autoClose:2000});
  const fetchData =async()=>{
    const data = await quizForAnalytics(userId);
    setquizes(data);
    setloading(false); 
  }
  // setInterval(fetchData,3000);
  const deleteThisQuiz =async(deleteId)=>{
    //  console.log(quizId);
     const response = await deleteQuiz(deleteId);
     alert(response); 
     fetchData()
  }
  useEffect(()=>{
    fetchData();
  },[]);
  const handleShare =(id)=>{
   const Link = `https://quizzie-nine-lake.vercel.app/quiz/${id}`;
   navigator.clipboard.writeText(Link);
   notify()
  }
  return (
    <div className='analytics-main'>
        {confirm &&
        <div className='delete-main' >
            <div className='delete-box'>
              <div className='delete-column'>
                 <h1>Are you confirm you <br />want to delete ?</h1>
                 <div className='delete-row'>
                    <button 
                        onClick={()=>{
                                 deleteThisQuiz(deleteId) 
                                 setdeleteId("")
                                 setconfirm(false) 
                                }} 
                        className='delete-button'  
                    >Confirm Delete</button>
                    <button onClick={()=>setconfirm(false)} className='cancel-button' >Cancel</button>
                 </div>
              </div>

            </div>
        </div>
       }
        <>
        <Sidebar button={"analytics"}/>
        <div className='analytics'>
           <h1>Quiz Analysis</h1>
           { !loading ?
           <div className='list'> 
            <table>
               <thead className='table-head'>
               <tr>
                  <th>S.No</th>
                  <th>Quiz Name</th>
                  <th>Created on </th>
                  <th>Impression</th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
               </thead>
               <tbody>
                 {quizes.map((data,index)=>{
                   return(
                     <tr key={index} className='table-data' style={{backgroundColor:`${index%2!=0?"#B3C4FF":"" }`}}>
                       <td className='index'>{1+index}</td>
                       <td>{data.name}</td>
                       <td>{data.createdOn}</td>
                       <td>{data.impression}</td>
                       <td><img src={edit} alt="" onClick={()=>navigate(`/update/${data._id}`)}  /></td>
                       <td><img src={deleteIcon} 
                                alt="" 
                                onClick={()=>{
                                      setdeleteId(data._id);
                                      setconfirm(true);
                                      console.log(deleteId);
                                       
                                      }
                                    } 
                            />
                       </td>
                       <td><img src={share} onClick={()=>handleShare(data._id)} alt="" /></td>
                       <td className='underline' onClick={()=>navigate(`/questions/${data._id}`)}><u  >Question Wise Analysis</u></td>
                     </tr>  
                   )})
                 }
               </tbody>
            </table>
           </div>:
           <div style={{marginTop:'15vh',zIndex:'1'}}>
               <BeatLoader loading={loading} color={"#45dabc"} size={50} />
           </div>
          } 
        </div>
        </>
        
        <ToastContainer />
    </div>
  )
}

export default Analytics;
