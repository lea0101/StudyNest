import React, { useEffect, useState, useRef, useMemo } from "react"
import '../../App.css';
import './FileCollab.css';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../Home/NavBar";

import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";

import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function FileUploader({loadFilesHandler}) {
  const maxFileSizeMB = 3;
  const { state } = useLocation(); 
  const roomName = state?.roomCode;

  const hiddenInputRef = useRef(null);

  const {getRootProps, getInputProps, open, acceptedFiles, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }
    }
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  var files = acceptedFiles.map(file => (
    <p key={file.path}>
      {file.path.slice(2)} [{file.size} bytes]
    </p>
  ));
    
  const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const file = formData.get("my-file");
        
        if (!file) return;
        
        if (file.type !== 'application/pdf')
        {
            alert("File must be of type PDF.");
            return;
        }
        if (file.size > (maxFileSizeMB * 1024 * 1024))
        {
            alert(`File size must not exceed ${maxFileSizeMB} MB.`);
            return;
        }
        const storageRef = ref(storage, `file_uploads/${roomName}/${uuidv4()}-${file.name}`);
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
                        loadFilesHandler();
                    });
            });
  }
  return (
    <div className="FileUploader">
    <form onSubmit={handleSubmit}>
      <div {...getRootProps({style})}>
        <input type ="file" name="my-file" required style ={{opacity: 0}} ref={hiddenInputRef}/>
        <input {...getInputProps()} />
        <p>Drag and Drop a File Here</p>
        <button className="file-form-button" type="button" onClick={open}>
            Browse Device
        </button>
      </div>
        <p className="file-upload-selection">{files}</p>
      <button className="file-form-button" type="submit">Submit</button>
      <br/>
      <br/>
      </form>
    </div>
  );
}
export default FileUploader;
  
