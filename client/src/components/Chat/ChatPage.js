import { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../../config/firebase";
import ChatBar from "./ChatBar";
//import MessageBox from "./MessageBox"
import "./Chat.css";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ChatPage() {
  const [user] = useAuthState(auth);
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  const navigate = useNavigate();
  const { roomName } = useParams(); // get room name from url params
  const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
  const roomCode = state?.roomCode;
  const dbMsgQuery = collection(db, 'rooms', roomCode, 'messages');
  const roomCode_copy = roomCode;

  //const storageRef = ref(storage, `user_icons/${file.name}`);
  //const uploadTask = uploadBytesResumable(storageRef, file);

  useEffect(() => {
    const q = query(
      dbMsgQuery,
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
  }, [dbMsgQuery]);

  const handleGoBack = () => {
    navigate(`/rooms/${roomName}`, { state: {roomCode : roomCode}});
  }

  return (
    <main className="chat-box">
      <div className="imessage">
        {
          messages?.map((message, i) => {
            // if the message sender changes
            const endTags = ((i === messages.length - 1) || message.uid !== messages[i + 1].uid) ? "": "no-tail";
            const messageOwner = (message.uid === user.uid) ? "me" : "them";
            const imageSrc = message.imageSrc;

            // if there is a change in message sender, add in profile and header
            if ((i === 0) || (messages[i - 1].uid !== message.uid)) {
              return (
                <>
                  <div className={`namebar ${messageOwner}`}>
                    <img className={`avatar ${messageOwner}`} src={message.avatar} alt="user avatar" />
                    <p className={`user-name ${messageOwner}`}>{message.name}</p>
                  </div>
                  <p key={message.id} className={`from-${messageOwner} ${endTags}`}>
                    {message.text}
                    { imageSrc  && <img className="msg_img" src={`${imageSrc}`} alt="error rendering"/> }
                  </p>
                </>
              )
            }
            return <p key={message.id} className={`from-${messageOwner} ${endTags}`}>
                      {message.text}
                      { imageSrc  && <img className="msg_img" src={`${imageSrc}`} alt="error rendering"/> }
                   </p>
          })
        }
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <ChatBar scroll={scroll} dbMsgQuery={dbMsgQuery} roomCode={roomCode_copy}/>
      <div className="room-code" onClick={handleGoBack}>
          <p>Go Back</p>
      </div>
    </main>
  );
};

export default ChatPage;
