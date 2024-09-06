import {useState} from 'react'
import Analytics from '../Analytics';
import "./createquiz.css";
import close from "../../assets/images/cross.png";
import cross from "../../assets/images/charm_cross.png"
import add from '../../assets/images/add.png';
import deleteIcon from '../../assets/images/delete.png'
import {makeQuiz} from '../../apis/quiz';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function CreateQuiz() {
  const [errors, setErrors] = useState({});
  const [create,setCreate]= useState(true);
  const navigate=useNavigate() 
  const [quizLink,setLink]=useState(false)
   const userId = sessionStorage.getItem("userId");
  const [loading]=useState(false);
  const [currentIndex,setCurrentIndex] = useState(0)
  const[Link,setQuizLink] = useState("")
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
  const AddQuestion =()=>{ 
    if(questions.length<5){
        setQuestions([...questions,{
            questionText:"",
            optionType:"Text",
            answer:'',
            options:[{ text: '' , imageUrl: '',answer:false}, { text: '' , imageUrl: '',answer:false}],
            timer:0
       }])
    }
  }
  const AddOption=()=>{
    if(questions[currentIndex].options.length <4){
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex].options.push({ text: '', imageUrl: '', answer: false });
      setQuestions(updatedQuestions);
    }
  }
  const removeQuestion = (index) => {
    if(questions.length>1 ){
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
  
      // Adjust the current index if necessary
      if (currentIndex >= updatedQuestions.length) {
        setCurrentIndex(updatedQuestions.length - 1);
      }
    
    }  
  };
  const removeOption =(index)=>{
    if(questions[currentIndex].options.length >2){
      const updatedQuestions = [...questions];
      updatedQuestions[currentIndex].options.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  }
  const handleChange=(e)=>{
    setQuiz({...Quiz,[e.target.name]:e.target.value});
  }
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
  const handleAnswerChange = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].options = updatedQuestions[currentIndex].options.map((option, i) => ({
      ...option,
      answer: i === index,  // Set answer to true only for the selected option
    }));
    setQuestions(updatedQuestions);
  };
  const setTimer = (value) => {
   if(value!=="OFF"){ 
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex].timer = value;
    setQuestions(updatedQuestions);
  }
  };
  const notify = () => toast.success("Link copied to Clipboard",{autoClose:2000});
  const validateToast=()=>toast.error("Atleast one answer should be correct",{autoClose:2000});
  const handleQuizSubmit=async()=>{
    const validationErrors = validateQuestions();
   
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log(errors);
      if (Object.keys(validationErrors).some(key => key.startsWith('answer'))) {
        validateToast();
      }
    } else {
      setErrors({});
      const updatedQuiz = {
        ...Quiz,
        questions: questions.map((q) => ({
          ...q,
          options: q.options.map((o) => ({ ...o })),
        })),
      };
  
    console.log(updatedQuiz);
     const data = await makeQuiz({...updatedQuiz});
     if(data.message === "Quiz Added"){
        setLink(true);
        setQuizLink(`https://quizzie-nine-lake.vercel.app/quiz/${data.quizId}`)
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
      let hasCorrectAnswer = false;
    question.options.forEach((option, optionIndex) => {
      if (!option.text && question.optionType === "Text") {
        validationErrors[`option${index}${optionIndex}`] = "Option text is required";
      }
      if (!option.imageUrl && question.optionType !== "Text") {
        validationErrors[`option${index}${optionIndex}`] = "Image URL is required";
      }
      if (option.answer) {
        hasCorrectAnswer = true;
      }
    });

    // Check if there is at least one correct answer
    if (Quiz.type !== "Poll Question" && !hasCorrectAnswer) {
      validationErrors[`answer`] = "At least one option must be marked as the correct answer";
    }
  });
  
    return validationErrors;
  };
  
  const handleContinue = () => {
    const validationErrors = validateQuiz();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setCreate(false);
    }
  };
  const validateQuiz =()=>{
    let validationErrors = {};
       // Validate quiz name
    if (!Quiz.name) {
      validationErrors.name = "Quiz name is required";
    }
    // Validate quiz type
    if (!Quiz.type) {
      validationErrors.type = "Quiz type is required";
    }
    return validationErrors;
  }

  
  return (
    <div >
          <div className='createQuiz-main'>
          <ToastContainer/> 
           { quizLink ?
              <div className='Share-Quiz'>
                    <h1>Congrats your Quiz is <br /> Published!</h1>
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
              <>
                  {create ? 
                    <div className='createQuiz-box' >
                        <input type="text" placeholder={errors.name || "Quiz name"} className={errors.name ?"input-error" :"input-Quizname"} name='name' value={Quiz.name} onChange={handleChange} /> 
                        <div className='quiz_Type'>
                            <div><h4>Quiz Type</h4></div>
                            <div><button name='type' value="Q & A" 
                                     onClick={handleChange} 
                                     style={{backgroundColor:`${Quiz.type =='Q & A'?" #60B84B":"white"}`,color:`${Quiz.type ==='Q & A'?"white":""}`,border:`${errors.type && "1px solid  red"}` }} 
                                  >Q & A
                                  </button>
                            </div>
                            <div><button name='type' value="Poll Question" 
                                     onClick={handleChange} 
                                     style={{backgroundColor:`${Quiz.type ==='Poll Question'?" #60B84B":"white"}`,color:`${Quiz.type ==='Poll Question'?"white":""}`,border:`${errors.type && "1px solid  red"}`}}
                                  >Poll Type
                                  </button>
                            </div>
                        </div>
                        <div className='next-buttons'>
                            <button className='cancel' onClick={()=>navigate("/analytics")}>Cancel</button>
                            <button className='continue' onClick={handleContinue}>continue</button>
                        </div>
                    </div>
                    :
                    <div className='createQuestion-box'>
                        <div className='questions-array'>
                          <div className='question_no'>
                            {questions.map((question,questionIndex)=>{
                              return(
                                  <>
                                    <div key={questionIndex} className='circle' onClick={()=>setCurrentIndex(questionIndex)} >{1+questionIndex} </div>
                                    { questionIndex !==0 ?
                                      <img 
                                      className='close' 
                                      src={close} alt="" 
                                      onClick={()=>removeQuestion(questionIndex)} />
                                      :
                                      <img src="" alt="" />
                                    }  
                                </>
                              )
                            })}
                            <div style={{height:"82px"}}><img src={add} className='add_question' onClick={AddQuestion}/> </div>
                          </div>
                          {questions.length>1 && <div className='max-question'>Max 5 questions</div>}

                        </div>
                        <div className='question-Input'>
                                <div>
                                    <input 
                                        name="questionText"
                                        onChange={(e)=>handleQuestionsValue(currentIndex,e)} 
                                        type="text" 
                                        className={errors[`questionText${currentIndex}`] ? "questionText-error" : "question_text"}
                                        placeholder={errors[`questionText${currentIndex}`] || "Enter question text"} 
                                        value={questions[currentIndex].questionText}  
                                    />
                                </div>
                                <div className='options-type'>
                                    <h4>Option Type </h4>
                                    <div>
                                        <input type="radio" value="Text" name='optionType' onChange={(e)=>handleQuestionsValue(currentIndex,e)}  />
                                        <label>Text</label>
                                    </div>
                                    <div>
                                        <input type="radio" value="Image URL" name='optionType' onChange={(e)=>handleQuestionsValue(currentIndex,e)} />
                                        <label>Image URL</label>
                                    </div>
                                    <div>
                                        <input type="radio" name="optionType" value="Text & Image URL" onChange={(e)=>handleQuestionsValue(currentIndex,e)} />
                                        <label>Text & Image URL</label>
                                    </div>  
                                </div>
                                <div className={Quiz.type ==="Q & A" ? "options-timer-box":"options-timer-box2"}>
                                  <div>
                                    { questions[currentIndex].optionType === "Text" || questions[currentIndex].optionType === "Image URL"  ?
                                      <div className='option-Value' >
                                          {questions[currentIndex].options.map((option,index)=>{
                                              return(
                                                <div key={index} className='option-row'  >
                                                      { Quiz.type ==="Q & A" && 
                                                          <input 
                                                          type="radio" 
                                                          name="answer" 
                                                          value="true" 
                                                          placeholder={errors[`option${currentIndex}${index}`] ||(questions[currentIndex].optionType === "Text" ? "Option text" : "Image URL")}
                                                          onChange={() => handleAnswerChange(index)} 
                                                          className={errors[`option${currentIndex}${index}`] ? "options-error" : "optionText-input"}
                                                          />
                                                      }
                                                      <input 
                                                        className={errors[`option${currentIndex}${index}`] ? "options-error" : "option_Text"}
                                                        type="text" 
                                                        name={questions[currentIndex].optionType==='Text'?"text":"imageUrl"} 
                                                        value={questions[currentIndex].optionType === 'Text' ? option.text : option.imageUrl}
                                                        placeholder={questions[currentIndex].optionType}
                                                        onChange={(e) =>
                                                          handleOptionChange(
                                                            index,
                                                            questions[currentIndex].optionType === 'Text' ? 'text' : 'imageUrl',
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    {index >1 && <img src={deleteIcon} alt="" onClick={()=>removeOption(index)} />}
                                                </div>
                                              )    
                                          })}
                                      </div>
                                      :
                                      <div className='option-Value ' >
                                          {questions[currentIndex].options.map((option,index)=>{
                                              return(
                                                <div key={index} className='option-row'>
                                                    { Quiz.type ==="Q & A" &&                                            
                                                      <input 
                                                          type="radio" 
                                                          name="answer" 
                                                          value="true" 
                                                          onChange={() => handleAnswerChange(index)}  
                                                      />
                                                    }
                                                    <input 
                                                      type="text" 
                                                      name='text'
                                                      className={errors[`option${currentIndex}${index}`] ? "options-error" : "imageUrl-text"}
                                                      value={option.text}
                                                      placeholder="Text"
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
                                                      className={errors[`option${currentIndex}${index}`] ? "options-error" : "imageUrl"}
                                                      value={option.imageUrl}
                                                      placeholder="image URL"
                                                      onChange={(e) =>
                                                        handleOptionChange(
                                                          index,
                                                          e.target.name,
                                                          e.target.value
                                                        )
                                                      } 
                                                    />
                                                    {index >1 &&<img src={deleteIcon} alt="" onClick={()=>removeOption(index)} />}
                                                </div>
                                              )    
                                          })}
                                      </div>
                                    }
                                    <div>
                                        <button 
                                          className='add_option'
                                          onClick={AddOption} 
                                        >Add Option
                                        </button>
                                    </div>
                                  </div>
                                  {Quiz.type ==="Q & A" &&
                                      <div className='timerbox' >
                                        <div>Timer</div>
                                        <div className='timerbutton'>
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
                                       className='cancel'
                                       onClick={()=>{
                                           setQuestions([{
                                               questionText:"",
                                               optionType:"Text",
                                               options: [{ text: '' , imageUrl: '',answer:false}, { text: '' , imageUrl: '',answer:false}],
                                               timer:0
                                            }])
                                           setCreate(true)
                                           setQuiz({
                                            name:"",
                                            type:""
                                           })
                                       }}
                                    >Cancel</button>
                                    <button className='create-Button' onClick={handleQuizSubmit}>Create Quiz</button>
                                </div>
                        </div>
                    </div>
                  }
              </>
           }
            
          </div>
        
        <Analytics  setloading={loading} className="behind" />
        
    </div>
  )
}

export default CreateQuiz
