import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import {getQuizForAnalysis,updateQuiz} from "../../apis/quiz";
import Analytics from '../Analytics';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import close from "../../assets/images/cross.png";
import cross from "../../assets/images/charm_cross.png"
import check from "../../assets/images/check.jpg"
import "./index.css";
import { useNavigate } from 'react-router-dom';

function updatedQuiz() {
const [errors, setErrors] = useState({});
const navigate=useNavigate() 
const [currentIndex,setCurrentIndex] = useState(0)
const [quizLink,setLink]=useState(false)
const[Link,setQuizLink] = useState("")
const [loading]=useState(false);
const {quizId} = useParams();
const userId = localStorage.getItem("userId");
const [Quiz,setQuiz]= useState({
    name:"",
    type:"",
    user:userId,
  })
  
const [questions,setQuestions]=useState([{
       questionText:"",
       optionType:"Text",
       options: [{ text: '' , imageUrl: '',answer:false}, { text: '' , imageUrl: '',answer:false}],
       timer:0
  }])
const fetchQuiz=async()=>{
   const data = await getQuizForAnalysis(quizId);   
   setQuiz({
    name: data.name,
    type: data.type,
    user: data.user
  });
  setQuestions(
    data.questions.map(question => ({
      questionText: question.questionText,
      optionType: question.optionType,
      options: question.options.map(option => ({
        text: option.text,
        imageUrl: option.imageUrl || '', 
        answer: option.answer || false 
      })),
      timer: question.timer || 0 
    }))
  );

}
useEffect(()=>{
    fetchQuiz()
},[])

  const notify = () => toast.success("Link copied to Clipboard",{autoClose:2000});
  const handleQuestionsValue = (index,e) => {
    setQuestions(prevQuestions => 
      prevQuestions.map((question, i) => 
        i === index ? { ...question,[e.target.name]:e.target.value } : question
      )
    );
  };
  const handleOptionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].options[index] = {
      ...updatedQuestions[currentIndex].options[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };
  const setTimer = (value) => {
   if(value!=="OFF"){ 
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].timer = value;
    setQuestions(updatedQuestions);
  }
  }; 
  const handleQuizSubmit=async()=>{
    const validationErrors = validateQuestions();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(errors);
    } else {
        const updatedQuiz = {
            ...Quiz,
            questions: questions.map((q) => ({
              ...q,
              options: q.options.map((o) => ({ ...o })),
            })),
          };     
    const data = await updateQuiz({...updatedQuiz},quizId);
     if(data){
        setLink(true);
        setQuizLink(`http://localhost:5173/Quiz/${data.quizId}`)
     }
   }
 }
  const validateQuestions = () => {
    let validationErrors = {};
    // Validate each question
    questions.forEach((question, index) => {
      if (!question.questionText) {
        validationErrors[`questionText${index}`] = "Question text is required";
      }
  
      // Validate options
      question.options.forEach((option, optionIndex) => {
        if (!option.text && question.optionType === "Text") {
          validationErrors[`option${index}${optionIndex}`] = "Option text is required";
        }
        if (!option.imageUrl && question.optionType !== "Text") {
          validationErrors[`option${index}${optionIndex}`] = "Image URL is required";
        }
      });
    });
  
    return validationErrors;
  };


return (
    <div>
        <div className='update-main'>
            <ToastContainer/> 
            {quizLink?
                 <div className='Share-Quiz'>
                 <h1>Congrats your Quiz is <br/>Updated </h1>
                 <div className='link'>{Link}</div>
                 <button 
                      className='share' 
                      onClick={()=>{
                         navigator.clipboard.writeText(Link)
                         notify()
                        
                       }}
                   >Share</button>
                 <img src={cross} className='cross' onClick={()=>navigate("/analytics")}/>
           </div>
           :
           <div className='createupdateQuestion-box'>
                  <div className='heading'><span>{Quiz.name}</span> <span>{Quiz.type}</span></div>
                  <div className='questions-array'>
                            <div className='question_no'>
                                {questions.map((question,questionIndex)=>{
                                return(
                                    <>
                                        <div key={questionIndex} className='circle' onClick={()=>setCurrentIndex(questionIndex)} >{1+questionIndex} </div>
                                    </>
                                )
                                })}   
                            </div>
                  </div>
                  <div className='update-Input'>
                    <div>
                        <input 
                            name="questionText"
                            onChange={(e)=>handleQuestionsValue(currentIndex,e)} 
                            type="text" 
                            className={errors[`questionText${currentIndex}`] ? "questionText-error" : "question_text"}
                            value={questions[currentIndex].questionText}  
                        />
                    </div>                
                    <div className='updateoptions-type'>
                        <div>Option Type</div>
                        <div className='option-typefixed'>
                          <input type="radio" checked  />
                          <div>{questions[currentIndex].optionType}</div>
                        </div>
                        
                    </div>
                    <div className="options-timer-box">
                             <div>
                                 { questions[currentIndex].optionType === "Text" || questions[currentIndex].optionType === "Image URL"  ?
                                 <div className='option-Value' >
                                     {questions[currentIndex].options.map((option,index)=>{
                                         return(
                                             <div key={index} className='option-row'  >
                                                 <input 
                                                     className={errors[`option${currentIndex}${index}`] ? "options-error" : "option_Text"}
                                                     type="text" 
                                                     name={questions[currentIndex].optionType==='Text'?"text":"imageUrl"} 
                                                     value={questions[currentIndex].optionType === 'Text' ? option.text : option.imageUrl}
                                                     onChange={(e) =>
                                                     handleOptionChange(
                                                         index,
                                                         questions[currentIndex].optionType === 'Text' ? 'text' : 'imageUrl',
                                                         e.target.value
                                                     )
                                                     }

                                                 />
                                                 { option.answer ===true &&  
                                                  <div>
                                                    <img width="30px" height="30px" src={check} alt="" />
                                                  </div>
                                                 }
                                             </div>
                                         )    
                                     })}
                                 </div>
                                 :
                                 <div className='option-Value ' >
                                     {questions[currentIndex].options.map((option,index)=>{
                                         return(
                                             <div key={index} className='option-row'>
                                                 <input 
                                                 type="text" 
                                                 name='text'
                                                 className='imageUrl-text'
                                                 value={option.text}
                                                 onChange={(e) =>
                                                     handleOptionChange(
                                                     index,
                                                     e.target.name,
                                                     e.target.value
                                                     )
                                                 }
                                                 />
                                                 <input   
                                                 type="text" 
                                                 name='imageUrl'
                                                 className='imageUrl'
                                                 value={option.imageUrl}
                                                 onChange={(e) =>
                                                     handleOptionChange(
                                                     index,
                                                     e.target.name,
                                                     e.target.value
                                                     ) } 
                                                 />
                                                { option.answer ===true && 
                                                  <div>
                                                    <img width="30px" height="30px" src={check} alt="" />
                                                 </div>
                                                 }
                                             </div>
                                         )    
                                     })}
                                 </div>
                                 }
                             </div>
                                {Quiz.type ==="Q & A" &&
                                    <div className='timerbox' >
                                        <div>Timer</div>
                                        <div className='updatetimer'>
                                        <button 
                                            onClick={(e)=>setTimer(0)}
                                            className={questions[currentIndex].timer === 0?"active":"" }
                                        >OFF
                                        </button> 
                                        <button 
                                            onClick={(e)=>setTimer(5)}
                                            className={questions[currentIndex].timer === 5?"active":"" }
                                        >5
                                        </button>
                                        <button 
                                            onClick={(e)=>setTimer(10)}
                                            className={questions[currentIndex].timer === 10?"active":"" }
                                        >10
                                        </button> 
                                        </div>   
                                   </div>
                                }
                    </div>
                    <div className='create-Quiz'>
                            <button 
                            className='update-cancel'
                            onClick={()=>{
                                setQuestions([{
                                    questionText:"",
                                    optionType:"Text",
                                    options: [{ text: '' , imageUrl: '',answer:false}, { text: '' , imageUrl: '',answer:false}],
                                    timer:0
                                    }])
                                setQuiz({
                                    name:"",
                                    type:""
                                })
                                navigate("/analytics")
                            }}
                            >Cancel</button>
                            <button className='update-quiz' onClick={handleQuizSubmit}>Update Quiz</button>
                    </div>
                  </div>
            </div>

        }
        </div>
        <Analytics  setloading={loading} className="behind" />
    </div>
  )
}

export default updatedQuiz;