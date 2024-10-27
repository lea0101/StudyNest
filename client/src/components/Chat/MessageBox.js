import { useState, useRef } from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./Chat.css";

const MessageBox = ({ message, endTags, handleEditingUpstream, handleDeleteUpstream}) => {
  const [user] = useAuthState(auth);
  const messageOwner = (message.uid === user.uid) ? "me" : "them";
  const [msgTxt, setMsgTxt] = useState(message.text);
  const [isClicked, setIsClicked] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [editMessage, setEditMessage] = useState("Edit")
  const msgFocus = useRef(null);
  //const msgTxt = useRef(message.text);

  function handleEdit() {
    if (editMessage === "Edit") {
      setIsEditable(true);
      setEditMessage("Confirm Edit");
      setTimeout(function() {
            msgFocus.current.focus();
      }, 0);
    } else {
      if (msgTxt === "") {
        alert("Cannot edit to an empty message");
      } else {
        handleEditingUpstream(message.id, msgTxt);
        setEditMessage("Edit");
        setIsEditable(false);
        setIsClicked(false);
      }
    }
  }

  const editMsg = async (e) => {
    e.preventDefault();
    setMsgTxt(e.currentTarget.textContent);
  }

  const handleMsgClick = () => {
    if (messageOwner === "me") {
      setIsClicked(true);
    }
  }

  const handleCancel = () => {
    setMsgTxt(message.text);
    setEditMessage("Edit");
    setIsEditable(false);
    setIsClicked(false);
  }

  return (<>
      <p onClick={handleMsgClick} contentEditable={isEditable}
        className={`from-${messageOwner} ${endTags}`}
        onInput={e => editMsg(e)}
        suppressContentEditableWarning={true}
        ref={msgFocus} >
          {msgTxt}
          {message.imageSrc && <img draggable="false" className="msg_img" src={`${message.imageSrc}`} alt="error rendering"/> }
      </p>
    { message.updated && <p className={`details ${messageOwner}`}> edited </p>}
    { isClicked && <div className="msgOptions">
      <button onClick={() => {handleEdit()}} > {editMessage} </button>
      <button onClick={() => {handleDeleteUpstream(message.id); setIsClicked(false);}} > Delete </button>
      <button onClick={() => {handleCancel()}}> Cancel </button>
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
