import React, { useState } from 'react'
import "./signup.css"
import { useNavigate } from "react-router-dom";
import { signupUser } from '../../apis/login';
import { AxiosError } from 'axios';

function SignupPage() {
const navigate = useNavigate();
const [formData,setFormData]= useState({
  name:"",
  email:"",
  password:"",
  confirmPassword:"",
})
const [errors,setErrors]= useState({
  name:"",
  email:"",
  password:"",
  confirmPassword:"",
})
const handleChange =(e)=>{
  setFormData({...formData,[e.target.name]:e.target.value});
}
const validateForm = (data) => {
  const errors = {};

  if (!data.name.trim()) {
      errors.name = 'Name is required';
  } else if (data.name.length < 4 || !/^[a-zA-Z]+$/.test(data.name)) {
      errors.name = 'Invalid Name';
  }

  if (!data.email.trim()) {
      errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Invalid Email';
  }

  if (!data.password) {
      errors.password = 'Password is required';
  } else if (data.password.length < 8) {
      errors.password = 'Weak password';
  }
  if(!data.confirmPassword){
    errors.confirmPassword = 'Password is required';
  }
  else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
const handleSubmit = async(e) => {
  e.preventDefault();
  const newErrors = validateForm(formData);
  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully!');
      const response = await signupUser({...formData});
      if(response){
        alert(response.message);
        navigate("/login")
      }
      
  } else {
      console.log('Form submission failed due to validation errors.');
      
    }
};
  return (
    <>
    <div className='main'>
        <div className='float'>
          <div className=' container'>
             <h1>QUIZZIE</h1>
             <div className='button-flex'>
                <button className='signup'> Sign Up</button>
                <button onClick={()=>navigate("/login")} > Log In</button>
             </div>
             <div className='input'>
                 <label>Name </label>
                 <input 
                  style={{border:`2px solid ${errors.name?"red":"white"}`}}
                   placeholder={`${errors.name?`${errors.name}`:""} `}
                   type="text" 
                   name="name"
                   onChange={handleChange}/>
                 <label>Email </label>
                 <input 
                   style={{border:`2px solid ${errors.email?"red":"white"}`}}
                   placeholder={`${errors.email?`${errors.email}`:""} `}
                   type="email" 
                   name="email"
                   onChange={handleChange}
                    />
                 <label>Password </label>
                 <input
                    style={{border:`2px solid ${errors.password?"red":"white"}`}}
                   placeholder={`${errors.password?`${errors.password}`:""} `}
                   type="password"
                   name="password" 
                   onChange={handleChange}/>
                 <label>Confirm Password </label>
                 <input 
                   style={{border:`2px solid ${errors.confirmPassword?"red":"white"}`}}
                   placeholder={`${errors.confirmPassword?`${errors.confirmPassword}`:""} `}
                   type="password"
                   name="confirmPassword" 
                   onChange={handleChange}/>
             </div>
             <button className='submit' onClick={handleSubmit}>Sign-Up</button>
          </div>
        </div>
    </div>
     
    </>
  )
}

export default SignupPage
