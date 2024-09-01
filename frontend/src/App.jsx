import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Signup/SignupPage';
import DashBoard from './components/Dashboard';
import Analytics from './components/Analytics';
import './App.css'
import CreateQuiz from './components/CreateQuiz';
import Quiz from './pages/Quiz';
import Questions from './components/Questions';
import UpdateQuiz from "./components/UpdateQuiz"
import ProtectedRoutes from './utils/ProtectedRoutes';
import Nopage from './pages/Nopage';

function App() {
 

  return (
   <BrowserRouter>
       <Routes>
         <Route path='/'element={<LoginPage/>} />
         <Route path='/register'element={<SignupPage/>} />
         <Route path='/:id' element={<Quiz/>}  />
         <Route path='*' element={<Nopage/>}/>
         <Route path='/dashboard' element={<ProtectedRoutes Component={DashBoard}/>}/> 
         <Route path='/analytics' element={<ProtectedRoutes Component={Analytics}/>}/>
         <Route path='/create' element={<ProtectedRoutes Component={CreateQuiz}/>}/>
         <Route path='/questions/:id' element={<ProtectedRoutes Component={Questions}/>}/>
         <Route path='/update/:quizId' element={<ProtectedRoutes Component={UpdateQuiz}/>}/>
        
       </Routes>
   </BrowserRouter>
  )
}

export default App
