import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Toastify(){
    const notify = () => toast.info("This is a toast notification !",{autoClose:2000});
    return (
      <div>
      <button onClick={notify}>Notify !</button>
      <ToastContainer />
    </div>
    )
}
export default Toastify;