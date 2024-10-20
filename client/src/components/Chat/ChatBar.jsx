import React, { useEffect, useState, useRef } from "react";
import { auth, storage, db } from "../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faPaperPlane, faUpload } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from "uuid";
import "./ChatBar.css";

const ChatBar = ({ scroll, dbMsgQuery, roomCode }) => {
  const [message, setMessage] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);
  const [uploadAnims, setUploadAnims] = useState(true);
  const [sendAnims, setSendAnims] = useState("");
  const inputFile = useRef(null);
  const { uid, displayName, photoURL } = auth.currentUser;

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


  const sendChat = async (e) => {
    e.preventDefault();
    setIsEnabled(false);
    // file handling 
    const file = inputFile.current.files[0];
    console.log(file)
    if (file) {
      if (file.type.substring(0, 6) !== 'image/' && file.type !== '.gif') {
        alert("File must be of gif or image.");
        setIsEnabled(true);
        return;
      }
      if (file.size > 10000000) {
        alert("File size must not exceed 10MB.");
        setIsEnabled(true);
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
        return;
      } else {
        console.log("sending normally")
        updateDb();
      }
    }

    scroll.current.scrollIntoView({ behavior: "smooth" });
  };


  async function updateDb(url) {
    //document.querySelector("#airplane").classList.add('fly');
    url = url ? url : "";
    console.log("updating DB with the following: " + url)
    await addDoc(dbMsgQuery, { // TODO make new collection per group
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
      setIsEnabled(true);
    });
  }




  return (
    <form className="chat_bar" onSubmit={(event) => sendChat(event)} >

      <div className="button_container">
        <input id='file_upload_button' onChange={() => handleButtonAnimation()}  type='file' accept='image/*,.gif' ref={inputFile} hidden/>
        <div id='file_button' className={`upload_button button ${uploadAnims}`} data-button onClick={handleUpload}>
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
    </form>
  );
};
export default ChatBar;
