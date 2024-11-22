import { useState, useEffect, useRef, setState } from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { SlackCounter, SlackSelector } from '@charkour/react-reactions';
import EmbedList from "./EmbedList";

import "./Chat.css";
import "./ReactionBar.css";

const MessageBox = ({ message, resets, handleCancelUpstream, endTags, handleEditingUpstream, handleDeleteUpstream, handleAddReactionUpstream, reactions}) => {
  const [user] = useAuthState(auth);
  const {displayName, email} = auth.currentUser;
  const messageOwner = (message.uid === user.uid) ? "me" : "them";
  const isSticker = (message.isSticker === true) ? "sticker no-tail" : "";
  const [isClicked, setIsClicked] = useState(false)
  const [isEditable, setIsEditable] = useState(false)
  const [editMessage, setEditMessage] = useState("Edit")
  const [showReactionChart, setShowReactionChart] = useState(false)
  const [showMenuReactionChart, setMenuShowReactionChart] = useState(false)
  const msgFocus = useRef(null);
  const msgTxt = useRef(message.text);
  const [emojiCounter, setEmojiCounter] = useState((reactions == null)?[] : reactions);

  var userName = displayName;
  if (displayName == null) {
     userName = email;
  }
  const extractUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex);
  }

  const richMessageText = (messageText) => {
    const urls = extractUrls(messageText);
    if (urls) {
      urls.forEach(url => {
        messageText = messageText.replace(url, `<a href="${url}" target="_blank">${url}</a>`);
      });
    }
    return messageText;
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
    //if (messageOwner === "me") {
      if ((isClicked === true && editMessage === "Edit") ||
      (isClicked == true && messageOwner != "me")) {
        setIsClicked(false);
        setMenuShowReactionChart(false);
      } else {
        setIsClicked(true);
      }
    //}
  }

  const handleCancel = () => {
    handleCancelUpstream();
    setEditMessage("Edit");
    setIsEditable(false);
    setIsClicked(false);
  }

  //const handleAdd = () => { setShowReactionChart(!showReactionChart) }
  const addReactionFromMenu = () => { setMenuShowReactionChart(!showMenuReactionChart) }

  const handleReturnedEmoji = (emoji) => {
    if (reactions == null) {
      reactions = []
    }
    const reactionNoUser = reactions.filter(a => !a.by.includes(userName));
    const newReactions = [...reactionNoUser, {emoji:emoji, by:userName}];
    handleAddReactionUpstream(message.id, newReactions);
    setEmojiCounter(newReactions);
  }

  return (<>
      <p onClick={handleMsgClick} contentEditable={isEditable}
        className={`${isSticker} from-${messageOwner} ${endTags} msgbubble`}
        onInput={e => editMsg(e)}
        suppressContentEditableWarning={true}
        ref={msgFocus}
        id={`msg-${message.id}`} >
          <span>{message.text}</span>
          {message.imageSrc && <img draggable="false" className={`${isSticker} msg_img`} src={`${message.imageSrc}`} alt="error rendering"/> }
          <EmbedList messageText={message.text}/>
      </p>
    { message.updated && <p className={`details ${messageOwner}`}> edited </p>}

    <div className={`reactionBar ${(emojiCounter.length === 0) ? "hide":""}`} style={{alignSelf: (messageOwner == "me") ? "flex-end": "start"}}>
      <SlackCounter onAdd={() => {console.log("no")}} counters={emojiCounter} onSelect={ handleReturnedEmoji }/>
      { showReactionChart ? (
      <div className={`selector ${messageOwner}`}>
        <SlackSelector/>
      </div>
    ) : null }
    </div>


    { isClicked && <div className={`msgOptions ${messageOwner}`}>
      {(messageOwner === "me") && !message.isSticker && <button onClick={() => {handleEdit()}} > {editMessage} </button> }
      {(messageOwner === "me") && <button onClick={() => {handleDeleteUpstream(message.id); setIsClicked(false);}} > Delete </button>}
      <button onClick={() => {addReactionFromMenu()}}> Add Reaction</button>
      <button onClick={() => {handleCancel()}}> Cancel </button>
      { showMenuReactionChart ? (
        <div className={`selector ${messageOwner}`}>
          <SlackSelector onSelect={ handleReturnedEmoji }/>
      </div>
    ) : null }
    </div>
      }
  </>)
}

export default MessageBox;
