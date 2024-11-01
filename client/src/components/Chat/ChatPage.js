import { useEffect, Fragment, useRef, useState } from "react";
import {
  doc,
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import ChatBar from "./ChatBar";
import MessageBox from "./MessageBox"
import SenderInfo from "./SenderInfo"
import "./Chat.css";
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [resets, setResets] = useState(0);
  const scroll = useRef();

  const navigate = useNavigate();
  const { roomName } = useParams(); // get room name from url params
  const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
  const roomCode = state?.roomCode;
  const dbMsgQuery = collection(db, 'rooms', roomCode, 'messages');
  const roomCode_copy = roomCode;

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
  }, );

  const handleGoBack = () => {
    navigate(`/rooms/${roomName}`, { state: {roomCode : roomCode}});
  }

  const handleMsgCancel = () => {
    setResets(resets + 1);
  }

  async function setEditing(msgId, txt) {
    console.log("Editing");
    console.log(msgId);
    console.log(txt);
    await updateDoc(doc(db, 'rooms', roomCode, 'messages', msgId), {
      "text" : txt,
      "updated" : true
    });
  }

  async function setDelete(msgId) {
    console.log("del");
    await deleteDoc(doc(db, 'rooms', roomCode, 'messages', msgId));
  }

  return (
    <main className="chat-box">
      <div className="imessage">
        {
          messages?.map((message, i) => {
            // if there is a change in message sender, add in profile and header
            const endTags = ((i === messages.length - 1) || message.uid !== messages[i + 1].uid) ? "": "no-tail";
              return (
                <Fragment key={i}>
                  { ((i === 0) || (messages[i - 1].uid !== message.uid)) &&
                  <SenderInfo message={message} key={`Senderinfo-${i}`} /> }
                  <MessageBox message={message} resets={resets} handleCancelUpstream={handleMsgCancel} endTags={endTags} handleEditingUpstream={setEditing} handleDeleteUpstream={setDelete} key={message.id}/>
                </Fragment>
              )
          })
        }
      <span ref={scroll}></span>
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <ChatBar scroll={scroll} dbMsgQuery={dbMsgQuery} roomCode={roomCode_copy}/>
      <div className="room-code" onClick={handleGoBack}>
          <p>Go Back</p>
      </div>
    </main>
  );
};

export default ChatPage;
