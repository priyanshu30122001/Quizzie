import React from 'react';
import {getQuiz} from "../../apis/quiz";
import { useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import "./index.css"
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import resultImage from '../../assets/images/result.png'

function Quiz() {
    let {id} = useParams();
    const [currentIndex,setIndex]=useState(0)
    const[time,setTime]= useState()
    const [correctCount,setCorrectCount]= useState(0)
    const [inCorrectCount,setInCorrectCount]= useState(0)
    const[result,setResult]= useState(false);
    
    const [Quiz,setQuiz]= useState({
        _id:"",
        name:"",
        type:"",
        createdOn:"",
        questions:[
           { questionText:"",
            optionType:"",
            options: [{_id:"", text: '' , imageUrl: '',answer:false,selectedCount:0}, {_id:"", text: '' , imageUrl: '',answer:false,selectedCount:0}],
            timer: 0,
            attempted: 0,
            correctCount: 0,
            incorrectCount: 0,
            _id:"",
        
        }
        ],
        impression: 0,
        user: "",
    })
    const fetchQuiz=async()=>{
        const data = await getQuiz(id);
        setQuiz({...data});
        if (data.questions.length > 0) {
            setTime(data.questions[0].timer);
        }        
    }
    const updateAttempted = async(id)=>{
      const reqUrl =`${backendUrl}/quiz/update/attempted/${id}`;
      const response = await axios.patch(reqUrl);
      console.log(response.data);
    }
    const checkAnswer=async(index)=>{
        console.log(Quiz.type);
        var id = Quiz.questions[currentIndex]._id
        updateAttempted(id);
      if(Quiz.questions[currentIndex].options[index].answer){
        setCorrectCount(correctCount+1);
        const reqUrl =`${backendUrl}/quiz/correctanswer/${id}`; 
        const response = await axios.patch(reqUrl);
        console.log(response.data);
        
      }
      else{
       
        setInCorrectCount(inCorrectCount+1);
        const reqUrl =`${backendUrl}/quiz/incorrectanswer/${id}`; 
        const response = await axios.patch(reqUrl);
        console.log(response.data);   
      }

      if(Quiz.questions.length-1 === currentIndex ){
        setResult(true);
      }
      setIndex(currentIndex+1);
      console.log(currentIndex);
      
    }
    
    const selectedAnswer=async(id)=>{
        console.log(Quiz.type);
        const reqUrl =`${backendUrl}/quiz/selectcount/${id}`; 
        const response = await axios.patch(reqUrl)
        if(Quiz.questions.length-1 === currentIndex ){
            setResult(true);
          }
        setIndex(currentIndex+1);
    }
   
    const increaseImpression =async()=>{
        const reqUrl =`${backendUrl}/quiz/update/impression/${id}`; 
        const response=await axios.patch(reqUrl);
        console.log(response.data.message);
    }
    useEffect(()=>{
        fetchQuiz();
        increaseImpression();    
    },[])
    useEffect(() => {
       
        let timerId;
        
        if (time > 0 && Quiz.questions[currentIndex].timer !== 0) {
            timerId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);
        } else if (time === 0 && Quiz.questions[currentIndex].timer !== 0) {
            if(Quiz.questions.length-1 === currentIndex){   
                setResult(true);
                setIndex(0);
            }
            setIndex(currentIndex + 1);
            setTime(Quiz.questions[currentIndex + 1]?.timer || 0); 
        }
    
        return () => clearInterval(timerId); 
    }, [time, Quiz]);
   
    const handleSubmit=async()=>{
     setResult(true);
    
    }
    return (
      <div className='interface' >
          {result ?
              <div className='result-container'>
                    { Quiz.type ==="Poll Question" ?
                      <h1>Thank you <br /> for participating in <br />the Poll </h1>
                      :
                      <div className='qna-result'>
                        <div>Congrats Quiz is completed</div>
                        <img src={resultImage} alt="" />
                        <div>{`Your Score is 0${correctCount}/0${Quiz.questions.length}`}</div>
                      </div>

                    }
              </div>
            :
            <div className='Quiz-container'>
              <div className='quiz-row1'>
                 <div className='question-number'>
                   {` 0${currentIndex+1}/0${Quiz.questions.length}`}
                 </div>
                 {Quiz.type !=="Poll Question" && Quiz.questions[currentIndex].timer > 0?
                  <div className='quiz-timer'>
                    {/* {Quiz.questions[currentIndex].timer} */}
                    {`00:${time}`}
                   </div>
                   :
                   <></>
                 }
              </div>
              <div className='quiz-row2'>
                  <div className=''>
                    {Quiz.questions[currentIndex].questionText}
                  </div>
              </div>
              <div className='quiz-row3' >
                {Quiz.questions[currentIndex].optionType ==="Text" ?
                     <div className='textgrid-container' >
                       {Quiz.questions[currentIndex].options.map((data,index)=>{
                         return( 
                              <>
                              {Quiz.type ==="Q & A" ?
                                <div
                                key={index}
                                className='quiz-option' 
                                onClick={()=>{
                                   checkAnswer(index)
                                   setTime(0)
                                }} 
                                >
                                {data.text}
                                </div>
                                :
                                <div
                                    className='quiz-option' 
                                    key={index}
                                    onClick={()=>selectedAnswer(data._id)} 
                                    >
                                    {data.text}
                                </div>
                              }
                              </>
                           )
                       })} 
                     </div>
                     :
                     <>
                      {Quiz.questions[currentIndex].optionType ==="Image URL" ?
                        <div className='imagegrid-container'>
                                {Quiz.questions[currentIndex].options.map((data,index)=>{
                                return( 
                                <>
                                    {Quiz.type ==="Q & A" ?
                                    <div
                                        key={index}
                                        className='image-div' 
                                        onClick={()=>{
                                            checkAnswer(index)
                                            setTime(0)
                                        }} 
                                        >
                                        <img width="324px" height="150px" src={data.imageUrl} alt="err" />
                                        </div>
                                        :
                                        <div
                                            className='image-div' 
                                            key={index}
                                            onClick={()=>selectedAnswer(data._id)} 
                                            >
                                            <img width="324px" height="145px" src={data.imageUrl} alt="err" />
                                        </div>
                                    }
                                </>
                                )
                              })} 
                        </div>
                          :
                        <div className='imageText-container'>
                            {Quiz.questions[currentIndex].options.map((data,index)=>{
                                return( 
                                <>
                                    {Quiz.type ==="Q & A" ?
                                    <div
                                        key={index}
                                        className='textImage-option' 
                                        onClick={()=>{
                                            checkAnswer(index)
                                            setTime(0)
                                        }} 
                                        >
                                        <div className='flexbasis-1'>{data.text }</div>
                                        <img width="136px" height="121px" src={data.imageUrl} alt="err" />
                                        </div>
                                        :
                                        <div
                                            className='textImage-option' 
                                            key={index}
                                            onClick={()=>selectedAnswer(data._id)} 
                                        >
                                        <div className='flexbasis-1'>{data.text }</div>
                                        <img width="136px" height="121px" src={data.imageUrl} alt="err" />
                                        </div>
                                    }
                                </>
                                )
                              })} 
                        </div>
                      }
                     </>  
                }                 
              </div>
              <div className='quiz-row4'>
                  {Quiz.questions.length-1 === currentIndex?    
                  <button className='next-button' onClick={handleSubmit} >Submit</button>
                  :
                  <button className='next-button' onClick={()=>setIndex(currentIndex + 1)} >NEXT</button>}
              </div>
            </div>
          }
     </div>
  )
}

export default Quiz;