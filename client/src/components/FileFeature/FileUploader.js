import React, { useEffect, useState } from "react"
import '../../App.css';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../NavBar";

import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

function FileUploader() {
  var [user] = useAuthState(auth);
  const { state } = useLocation(); 
  const roomName = state?.roomCode;

    const handleSubmit = (e) => {
        e.preventDefault();
        const file = e.target[0]?.files[0];
        
        if (!file) return;
        
        if (file.type !== 'application/pdf')
        {
            alert("File must be of type PDF.");
            return;
        }
        if (file.size > 3000000)
        {
            alert("File size must not exceed 3MB.");
            return;
        }
        const storageRef = ref(storage, `file_uploads/${roomName}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
            (snapshot) => {},
            (error) => 
            {
                alert("Error uploading file");
            },
            () => 
            {
                getDownloadURL(uploadTask.snapshot.ref).then(
                    (downloadURL) => 
                    {
                    });
            });
  }

  return (
    <div className="FileUploader">
      <NavBar />
	<form onSubmit={() => handleSubmit} className='prefs-form'>
        <input id='file_upload_button' type='file' accept='application/pdf' />
	   <button type="submit" class='save-button'>Upload File</button>
	</form>
    </div>
  );
}

export default FileUploader;
