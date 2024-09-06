import React, { useState } from 'react'
import './login.css'
import { useNavigate } from "react-router-dom";
import { loginUser } from '../../apis/login.js';


function LoginPage() {

const [error,setError]=useState(false)
const navigate = useNavigate()
const [formData,setFormData]= useState({
  email:"",
  password:""
})

const handleChange=(e)=>{
  setFormData({...formData,[e.target.name]:e.target.value});
}
const onSubmit=async(e)=>{
  if( !formData.email || !formData.password ){
    setError(true);
    console.log(error);
    
  }
  const response = await loginUser(formData.email,formData.password);
  if(response.user){
    setError(false);
    console.log(response);
    sessionStorage.setItem("token", response.token);
    sessionStorage.setItem("User", response.user);
    sessionStorage.setItem("userId", response.userId);
    navigate("/")

  }
  else{
    setError(true);
    alert('Access Denied')
    setFormData({
      email: '',
      password: ''
    })
   
  }
}
  return (
    <div className='main'>
        <div className='float'>
          <div className=' container'>
             <h1>QUIZZIE</h1>
             <div className='button-flex'>
                <button 
                  onClick={()=>navigate('/register')} 
                > Sign Up</button>
                <button className='login'> Log In</button>
             </div>
             <div className='input'>
                 <label>Email </label>
                 <input 
                   style={{border:`2px solid ${error?"red":"white"}`}}
                   placeholder={`${error?"Invalid email":""} `}
                   type="email" 
                   name='email'
                   onChange={handleChange}
                   value={formData.email}
                    />
                 <label>Password </label>
                 <input 
                   value={formData.password}
                   type="password"
                   name='password'
                   style={{border:`2px solid ${error?"red":"white"}`}}
                   placeholder={`${error?"invalid Password":""} `}
                   onChange={handleChange} />
             </div>
             <button className='submit' onClick={onSubmit}>Login</button>
          </div>
        </div>
    </div>
  )
}

export default LoginPage
