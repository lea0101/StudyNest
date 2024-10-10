import React, { useState } from "react";
import { auth, db } from "../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./ChatBar.css";

const ChatBar = ({ scroll }) => {
  const [message, setMessage] = useState("");

  const sendChat = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter a real message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    await addDoc(collection(db, "messages"), { // TODO make new collection per group
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={(event) => sendChat(event)} >
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button class="button" type="submit">Send</button>
    </form>
  );
};

export default ChatBar;
