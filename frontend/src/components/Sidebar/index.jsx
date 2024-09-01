import React from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
function Sidebar({button}) {
    const navigate = useNavigate() 
    const logOut=()=>{
      navigate("/");
      localStorage.clear();
    }
   
  return (
    <>
        <div className='sidebar'>
            <h1>QUIZZIE</h1>
            <div className='menu'>
                <button
                  style={{boxShadow:`${button === "dashboard" ? " 0px 0px 14px 0px #0000001F ":""}`}} 
                  onClick={()=>navigate("/dashboard")}
                >Dashboard</button>
                <button
                  style={{boxShadow:`${button === "analytics" ? " 0px 0px 14px 0px #0000001F ":""}`}} 
                  onClick={()=>navigate("/analytics")}
                >Analytics</button>
                <button
                  className='create-quiz'
                  onClick={()=>navigate("/create")}
                  >Create Quiz</button>

            </div>
            <button 
              className='logout'
              onClick={logOut}>Logout</button>
        </div>
    </>
  )
}

export default Sidebar