import React, { useState } from "react";
import { auth, db } from "../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./ChatBar.css";

const ChatBar = ({ scroll, dbMsgQuery }) => {
  const [message, setMessage] = useState("");

  const sendChat = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Error cannot send empty message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, dbMsgQuery), { // TODO make new collection per group
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    }).catch((err) => {
      alert("Error sending message");
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={(event) => sendChat(event)} >
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="button" type="submit">Send</button>
    </form>
  );
};

export default ChatBar;
