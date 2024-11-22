import { useState, useRef } from "react";
import { auth, storage } from "../../config/firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from "uuid";
import Emaill from "./Emaill"
import UserList from "./UserList";
import StickerPopup from "./StickerPopup";
import "./ChatBar.css";

const ChatBar = ({ scroll, dbMsgQuery, roomCode, roomName }) => {
  const [message, setMessage] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [pingEnabled, setPingEnabled] = useState(true);
  const [pingList, setPingList] = useState([]);
  const inputFile = useRef(null);
  const { uid, displayName, photoURL } = auth.currentUser;


  /*
   * UPLOAD FUNCTIONS
   */
  const handleUpload = () => {
    inputFile.current?.click();
    return
  }

  const handleButtonAnimation = () => {
    document.querySelector("#file_button").classList.remove('is-loading', 'is-completed');
    console.log("hanlding")
    console.log(inputFile.current.files);
    if (inputFile.current.files) {
      console.log("inside")
      document.querySelector("#file_button").classList.add('is-loading');
      setTimeout(function() {
        document.querySelector("#file_button").classList.add('is-completed');
      }, 1000);

    }
  }


  /*
   * CHAT FUNCTIONS
   */
  const sendChatEvent = async (e) => {
    e.preventDefault();
    sendChat();
  }

  function sendChat() {
    setIsEnabled(false);
    setPingEnabled(false);
    // file handling
    const file = inputFile.current.files[0];
    console.log(file)
    if (file) {
      if (file.type.substring(0, 6) !== 'image/' && file.type !== '.gif') {
        alert("File must be of gif or image.");
        setIsEnabled(true);
        setPingEnabled(true);
        return;
      }
      if (file.size > 10000000) {
        alert("File size must not exceed 10MB.");
        setIsEnabled(true);
        setPingEnabled(true);
        return;
      }
      const storageRef = ref(storage, `message_data/${roomCode}/${uuidv4()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed", (snapshot) => {},
        (error) => { alert("Error uploading file"); },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log(url);
            return url
          }).then((url)=> {
            console.log("from image to update")
            console.log(url);
            updateDb(url);
          });
        }
      );
    }
    else {
      // message handling
      if (message.trim() === "" && !file) {
        alert("Error cannot send empty message");
        setIsEnabled(true);
        setPingEnabled(true);
        return;
      } else {
        console.log("sending normally")
        updateDb();
      }
    }
  };


  function updateDb(url) {
    //document.querySelector("#airplane").classList.add('fly');
    url = url ? url : "";
    console.log("updating DB with the following: " + url)
    addDoc(dbMsgQuery, {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      imageSrc: url,
      uid,
    }).catch((err) => {
      alert("Error sending message");
    }).then(() => {
      setMessage("");
      console.log("Cleaning the image stuff")
      if (inputFile.current) {
          inputFile.current.value = "";
          inputFile.current.type = "file";
      }
      document.querySelector("#file_button").classList.remove('is-loading', 'is-completed');
      scroll.current.scrollIntoView({ behavior: "smooth" });
      setPingEnabled(true);
      setIsEnabled(true);
    });
  }

  /*
   * PING FUNCTIONS
   */

  function addPing(email) {
    setPingList([...pingList, email]);
    console.log(auth.currentUser);
    console.log(pingList);
  }

  function removePing(email) {
    setPingList(pingList.filter(e => e !== email));
    console.log(pingList);
  }

  function sendPingHandler() {
    sendChat();
  }

  function sendStickerHandler(sticker_url) {
    console.log(`pretend sending ${sticker_url}`)
    //document.querySelector("#airplane").classList.add('fly');
    addDoc(dbMsgQuery, {
      text: "",
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      imageSrc: sticker_url,
      isSticker: true,
      uid,
    }).catch((err) => {
      alert("Error sending message");
    }).then(() => {
      scroll.current.scrollIntoView({ behavior: "smooth" });
      setPingEnabled(true);
      setIsEnabled(true);
    });
  }




  /*
   * RETURN
   */
  return (
    <form className="chat_bar"
      autoComplete="off"
      onSubmit={(event) => sendChatEvent(event)} >

      <StickerPopup sendStickerHandler={sendStickerHandler}/>
      <div className="button_container">
        <input id='file_upload_button' onChange={() => handleButtonAnimation()}  type='file' accept='image/*,.gif' ref={inputFile} hidden/>
        <div id='file_button' className="upload_button button" data-button onClick={handleUpload}>
          <span className="button__text">
            <FontAwesomeIcon icon={faUpload} />
          </span>
          <span className="button__success">
            <FontAwesomeIcon icon={faCheck} />
          </span>
        </div>
      </div>

      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="send_button button" type="submit" disabled={!isEnabled}>
        <FontAwesomeIcon icon={faPaperPlane} id='airplane' className={`plane ${isEnabled ? "" : "is-sent"}`}/>
      </button>
      <UserList addPing={addPing} removePing={removePing} roomCode={roomCode}/>
      <Emaill isEnabled={pingEnabled} message={message} roomName={roomName} recipients={pingList} sendPingHandler={sendPingHandler}/>
    </form>
  );
};
export default ChatBar;
