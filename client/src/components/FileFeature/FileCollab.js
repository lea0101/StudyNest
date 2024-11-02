import React, { useState, useEffect } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import FileViewer from "./FileViewer";
import NavBar from "../Home/NavBar";
import "./FileCollab.css";
import "../../App.css";

const FileCollab = () => {
    const [ files, setFiles ] = useState([]);
    const { state } = useLocation();
    const [ selectedFile, setSelectedFile ] = useState('');
    const roomName = state?.roomCode;
    const getFileList = async () => {
        const storageRef = await ref(storage, `file_uploads/${roomName}`);
        const result = await listAll(storageRef);
        const urlPromises = result.items.map((data) => data.name);
        return Promise.all(urlPromises);
    };

    const loadFilesHandler = async () => {
        const urls = await getFileList();
        setFiles(urls);
    };

    useEffect(() => {
      loadFilesHandler();
     }, []);

    return (
        <div className="module">
            <NavBar />
            <br/>
            <br/>
            <br/>
            <h1>Collaborate on a File</h1>
            <div className="container">
                <div className="files-sidebar">
                    <h3>Files in this Room</h3>
                    {files.map((val) => (
                        <button className="file-list-button" key={val.substr(0,37)} onClick={() => setSelectedFile(`file_uploads/${roomName}/${val}`)}>{val.substr(37)}</button>
                    ))}
                    <FileUploader loadFilesHandler={loadFilesHandler}/>
                </div>
        <br/>
                <div className="files-mainviewer">
        <br/>
        <br/>
                    { (selectedFile &&
                    <FileViewer file={selectedFile} key={selectedFile}/>) || (<p>Select a file to view.</p>)}
                </div>
            </div>
        </div>
    );
}

export default FileCollab;
