import React, { useEffect } from 'react'
import "./SideBar.css";
import { useContext } from 'react';
import { ChatContext } from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid';
const SideBar = () => {

  const {allThreads,setAllThreads,currThreadId,setNewChat,setReply,setPrompt,setPrevChat,setCurrThreadId} = useContext(ChatContext);

const getAllThreads = async () => {
    const res = await fetch("http://localhost:5000/api/thread");
    const data = await res.json();

    console.log("DATA:", data);

    const filterData = data.data.map((thread) => {
        return {
            threadId: thread.threadId,
            title: thread.title
        };
    });
   setAllThreads(filterData);
};
useEffect(()=>{
  getAllThreads();
},[currThreadId])

// to create new chat
const createNewChat = () =>{
  setNewChat(true);
  setPrompt("");
  setReply(null);
  setCurrThreadId(uuidv1());
  setPrevChat([]);
}



  return (

    <section className='sidebar'>
      {/* new chat btn */}
     <button onClick={createNewChat}>
  <img className='logo' src="src/assets/image.png" alt='gpt logo'></img>
      <i className="fa-solid fa-pen-to-square"></i>
     
     </button>
     

      {/* history */}
      <ul className='history'>
       {
        allThreads?.map((thread,idx)=>{
        return  <li  key={idx}>{thread.title}</li>
        })
       }
      </ul>
      {/* sign */}
      <div className="sign">
     <p>By ApnaCollege &hearts;</p>
      </div>
    </section>


  )
}

export default SideBar
