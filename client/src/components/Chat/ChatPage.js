import { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import ChatBar from "./ChatBar";
import MessageBox from "./MessageBox"
import "./Chat.css";

import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ChatPage = () => {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, []);


for (const [index, message] of messages.entries()) {
            // if there is a change in message sender, add in profile and header
          }

  return (
    <main className="chat-box">
      <div className="imessage">
        {
          messages?.map((message, i) => {
            // if the message sender changes
          const endTags = ((i == messages.length - 1) || message.uid != messages[i + 1].uid) ? "end-msg" : "default-msg";
          const messageOwner = (message.uid === user.uid) ? "from-me" : "from-them";

          if ((i == 0) || (messages[i - 1].uid != message.uid)) {
            return (
              <>
                <div class="namebar">
                  <img class={`avatar ${message.uid === user.uid ? "avatar-me" : ""}`} src={message.avatar} alt="user avatar" />
                  <p class={`user-name ${message.uid === user.uid ? "user-name-right" : "user-name-left"}`}>{message.name}</p>
                </div>
            <p class={`${messageOwner} ${endTags}`}> {message.text}</p>
              </>
            )
          }
          return <p class={`${messageOwner} ${endTags}`}> {message.text}</p>
          // if the end of the messages from the user
          //if ((i == messages.length - 1) || message.uid != messages[i + 1].uid) {
          //  return <p className={`from-me ${message.uid === user.uid ? "from-me-end" : "from-them-end"}`}>{message.text}</p>
          //}
          //return <p className={`from-me ${message.uid === user.uid ? "from-me-default" : "from-them-default"}`}>{message.text}</p>
          //messages?.map((message) => (
          //<MessageBox key={message.id} message={message} />
          //))
        })}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <ChatBar scroll={scroll} />
    </main>
  );
};

export default ChatPage;
