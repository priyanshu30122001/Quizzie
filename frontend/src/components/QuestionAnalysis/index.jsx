import React, { useEffect, useState } from 'react'
import Sidebar from '../Sidebar';
import { useParams } from 'react-router-dom';
import {getQuizForAnalysis} from "../../apis/quiz";
import "./index.css"

function Questionanalysis() {
 const { id } = useParams();
 const[quiz,setQuiz]=useState({
  _id:"",
  name:"",
  type:"",
  createdOn:"",
  questions:[
     { questionText:"",
      optionType:"",
      options: [{_id:"", text: '' , imageUrl: '',answer:false,selectedCount:0}],
      timer: 0,
      attempted: 0,
      correctCount: 0,
      incorrectCount: 0,
      _id:"",
  
  }
  ],
  impression: 0,
  user: "",
});
 const fetchQuiz=async()=>{
  const data = await getQuizForAnalysis(id);
  if(data._id === id){
    setQuiz({...data});
  }
  console.log(quiz);
 }
 useEffect(()=>{
   fetchQuiz()

console.log(id);

 },[])
    return (
    <div className='Question-analysis'>
        <Sidebar button={"analytics"}/>
        <div className='Question-analysis-main'>
            <div className='first-row'>
              <div className='quiz_name'>
                {quiz.name}Question Analysis
              </div>
              <div className='quiz_impression'>
                 <p>Created on : {quiz.createdOn}</p>
                 <p>Impressions : {quiz.impression}</p>
              </div>

            </div>
            <div className='second-row'>
              {quiz.type === "Q & A"?
                <>{quiz.questions.map((data,index)=>{
                    return(
                      <div className='question-row' key={index}>
                          <div className='questions-text'>Q{index+1} {data.questionText} </div>
                          <div className='analytics_boxes'>
                             <div><span>{data.attempted}</span><p>people Attempted the question</p></div>
                             <div><span>{data.correctCount}</span>people Answered Correctly</div>
                             <div><span>{data.incorrectCount}</span>people Answered Incorrectly</div>
                          </div>
                      </div>
                    )})
                }</>
               :
                <>{quiz.questions.map((data,index)=>{
                    return(
                      <div className='question-row' key={index}>
                        <div className='questions-text'>Q{index+1} {data.questionText} </div>
                        <div className='poll-selectCount'>
                             {data.options.map((option,opIndex)=>{
                                return(
                                  <div className='selectedCount'><span>{option.selectedCount}</span>{option.text===""? `option ${opIndex+1}`:option.text}</div>
                                )

                             })}

                          </div>
                      </div>

                    )})
                     
                 }
                </>
              }
            </div>
        </div>
    </div>
  )
}

export default Questionanalysis;