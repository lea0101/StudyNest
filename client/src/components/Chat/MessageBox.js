import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./Chat.css";

const MessageBox = ({ message, endTags, setEditing, setDelete}) => {
  const [user] = useAuthState(auth);
  const messageOwner = (message.uid === user.uid) ? "me" : "them";
  const [isClicked, setIsClicked] = useState(false)

  //function handleClick() {

  //}

    //
  return (<>
      <p onClick={()=> {setIsClicked(!isClicked)}} className={`from-${messageOwner} ${endTags}`}>
                      {message.text}
                      { message.imageSrc && <img className="msg_img" src={`${message.imageSrc}`} alt="error rendering"/> }
                   </p>
    { isClicked && <div>
      <button onClick={() => {setEditing(message.id); setIsClicked(false);}} > edit </button>
      <button onClick={() => {setDelete(message.id); setIsClicked(false);}} > delete </button>
    </div>
      }
  </>)
}
//  return (
//    <div 
//      className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
//      <img
//        className="avatar"
//        src={message.avatar}
//        alt="user avatar"
//      />
//      <p className={`${message.uid === user.uid ? "user-name-right" : "user-name-left"}`}>{message.name}</p>
//      <p className={`${message.uid === user.uid ? "from-me" : "from-them"}`}>{message.text}</p>
//    </div>
//  );
//};

export default MessageBox;
