import React, { useState, useRef } from "react";
import { auth, storage, db } from "../../config/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "./ChatBar.css";

const ChatBar = ({ scroll, dbMsgQuery, roomCode }) => {
  const [message, setMessage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const inputFile = useRef(null);
  const { uid, displayName, photoURL } = auth.currentUser;

  const sendChat = async (e) => {
    e.preventDefault();

    // file handling 
    const file = inputFile.current.files[0];
    console.log(file)
    if (file) {
      if (file.type.substring(0, 6) !== 'image/' && file.type !== '.gif') {
        alert("File must be of gif or image.");
        return;
      }
      if (file.size > 10000000) {
        alert("File size must not exceed 10MB.");
        return;
      }
      const storageRef = ref(storage, `message_data/${roomCode}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on("state_changed", (snapshot) => {},
        (error) => { alert("Error uploading file"); },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setImageURL(url);
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
        return;
      } else {
        console.log("sending normally")
        updateDb();
      }
    }

    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  async function updateDb(url) {
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
      setImageURL("");
      console.log("Cleaning the image stuff")
      if (inputFile.current) {
          inputFile.current.value = "";
          inputFile.current.type = "file";
      }
    });
  }

  return (
    <form onSubmit={(event) => sendChat(event)} >
    <input id='file_upload_button' type='file' accept='image/*,.gif' ref={inputFile}/>
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
