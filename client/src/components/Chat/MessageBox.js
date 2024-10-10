import React from "react";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const MessageBox = ({ message }) => {
  const [user] = useAuthState(auth);
  return (
    //<div className={`imessage`}>
      //<img
      //  className="avatar"
      //  src={message.avatar}
      //  alt="user avatar"
      ///>
      //<p className={`${message.uid === user.uid ? "user-name-right" : "user-name-left"}`}>{message.name}</p>
      <p className={`${message.uid === user.uid ? "from-me" : "from-them"}`}>{message.text}</p>
    //</div>
  );
};

export default MessageBox;
