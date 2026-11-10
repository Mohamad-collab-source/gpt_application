import React, { useContext, useEffect, useState } from 'react'
import './Chat.css';
import { ChatContext } from './MyContext.jsx';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"
const Chat = () => {
  const {newChat,prevChat,reply} = useContext(ChatContext);
  const [latestReply, setLatestReply] = useState(null);

  // adding typing effect
 useEffect(()=>{
  
  
if(!prevChat?.length) return;

const content = reply.split(" "); // individaul words
let idx = 0;
const interval = setInterval(()=>{
  setLatestReply(content.slice(0,idx+1).join(" "));
  idx++;
  if(idx>=content.length) 
    clearInterval(interval);
  
},40);
return ()=> clearInterval(interval);
  },[prevChat,reply])



  return (
  <>
  {newChat && <h1>Start a New Chat</h1>}
  <div className="chats">
    {
      prevChat?.map((chat,idx)=>
        <div className={chat.role === "user"?"userDiv":"gptDiv"} key={idx}>
          {
            chat.role === "user" ?
            <p className='userMessage'>{chat.content}</p>:<></>
          }
        </div>
      )
    }
    {
      prevChat.length > 0 && latestReply != null && 
      <div className="gptDiv" key={"typing"}>
                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
      </div>
    }
  
  </div>
  </>
  )
}

export default Chat
