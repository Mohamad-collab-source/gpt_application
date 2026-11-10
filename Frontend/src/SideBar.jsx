
import React, { useEffect, useContext } from 'react';
import "./SideBar.css";
import { ChatContext } from './MyContext.jsx';
import { v1 as uuidv1 } from 'uuid';
import logo from './assets/image.png';

const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SideBar = () => {

  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setReply,
    setPrompt,
    setPrevChat,
    setCurrThreadId
  } = useContext(ChatContext);

  const getAllThreads = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/thread`);
      const data = await res.json();

      console.log("DATA:", data);

      const filterData = data.data.map((thread) => {
        return {
          threadId: thread.threadId,
          title: thread.title
        };
      });

      setAllThreads(filterData);

    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  // To create new chat
  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChat([]);
  };

  return (
    <section className='sidebar'>

      {/* New chat button */}
      <button onClick={createNewChat}>
        <img className='logo' src={logo} alt='gpt logo' />
        <i className="fa-solid fa-pen-to-square"></i>
      </button>

      {/* History */}
      <ul className='history'>
        {
          allThreads?.map((thread, idx) => {
            return <li key={idx}>{thread.title}</li>;
          })
        }
      </ul>

      {/* Sign */}
      <div className="sign">
        <p>By ApnaCollege &hearts;</p>
      </div>

    </section>
  );
};

export default SideBar;
