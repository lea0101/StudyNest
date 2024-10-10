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

  return (
    <main className="chat-box">
      <div className="imessage">
        {
          messages?.map((message, i) => {
          // if the message sender changes
          const endTags = ((i == messages.length - 1) || message.uid != messages[i + 1].uid) ? "": "no-tail";
          const messageOwner = (message.uid === user.uid) ? "me" : "them";

          // if there is a change in message sender, add in profile and header
          if ((i == 0) || (messages[i - 1].uid != message.uid)) {
            return (
              <>
                <div class={`namebar ${messageOwner}`}>
                  <img class={`avatar ${messageOwner}`} src={message.avatar} alt="user avatar" />
                  <p class={`user-name ${messageOwner}`}>{message.name}</p>
                </div>
              <p class={`from-${messageOwner} ${endTags}`}> {message.text}</p>
              </>
            )
          }
          return <p class={`from-${messageOwner} ${endTags}`}> {message.text}</p>
        })}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <ChatBar scroll={scroll} />
    </main>
  );
};

export default ChatPage;
