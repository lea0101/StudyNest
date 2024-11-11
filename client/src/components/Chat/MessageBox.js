import { useState, useEffect, useRef } from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Microlink from "@microlink/react";

import "./Chat.css";

const MessageBox = ({ message, resets, handleCancelUpstream, endTags, handleEditingUpstream, handleDeleteUpstream}) => {
  const [user] = useAuthState(auth);
  const messageOwner = (message.uid === user.uid) ? "me" : "them";
  const [isClicked, setIsClicked] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [editMessage, setEditMessage] = useState("Edit")
  const msgFocus = useRef(null);
  const msgTxt = useRef(message.text);

  const richMessageText = (messageText) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = messageText.match(urlRegex);
    if (urls) {
      urls.forEach(url => {
        messageText = messageText.replace(url, `<a href="${url}" target="_blank">${url}</a>`);
      });
    }
    return messageText;
  }

  const embedsFromText = (messageText) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = messageText.match(urlRegex);
    if (urls) {
      return urls.map((url, index)=> {
        return <Microlink url={url} key={index} />;
      });
    }
  }

  useEffect(() => {
    const text = document.getElementById(`msg-${message.id}`);
    text.children[0].innerHTML = richMessageText(message.text);
  }, [resets]);

  function handleEdit() {
    console.log(msgTxt.content)
    if (editMessage === "Edit") {
      setIsEditable("plaintext-only");
      setEditMessage("Confirm Edit");
      setTimeout(function() {
            msgFocus.current.focus();
      }, 0);
    } else {
      if (msgTxt.content === "") {
        alert("Cannot edit to an empty message");
      } else if (msgTxt.content === message.text) {
        setEditMessage("Edit");
        setIsEditable(false);
        setIsClicked(false);
      } else {
        handleEditingUpstream(message.id, msgTxt.content);
        setEditMessage("Edit");
        setIsEditable(false);
        setIsClicked(false);
      }
    }
  }

  const editMsg = async (e) => {
    e.preventDefault();
    msgTxt.content = e.currentTarget.textContent;
  }

  const handleMsgClick = () => {
    if (messageOwner === "me") {
      if (isClicked === true && editMessage === "Edit") {
        setIsClicked(false);
      } else {
        setIsClicked(true);
      }

    }
  }

  const handleCancel = () => {
    handleCancelUpstream();
    setEditMessage("Edit");
    setIsEditable(false);
    setIsClicked(false);
  }

  return (<>
      <p onClick={handleMsgClick} contentEditable={isEditable}
        className={`from-${messageOwner} ${endTags}`}
        onInput={e => editMsg(e)}
        suppressContentEditableWarning={true}
        ref={msgFocus}
        id={`msg-${message.id}`} >
          <span>{message.text}</span>
          {message.imageSrc && <img draggable="false" className="msg_img" src={`${message.imageSrc}`} alt="error rendering"/> }
          {embedsFromText(message.text)}
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

export default MessageBox;
