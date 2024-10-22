import React, { useState } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import FileViewer from "./FileViewer";
import NavBar from "../NavBar";
import "./FileCollab.css";

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

    const loadFiles = async () => {
        const urls = await getFileList();
        setFiles(urls);
    };

    loadFiles();
    return (
        <div className="module">
            <NavBar />
            <br/>
            <br/>
            <br/>
            <div>
                <h1>Collaborate on a File!</h1>
                <div className="files-sidebar">
                    <h3>Files in this Room</h3>
                    {files.map((val) => (
                        <button onClick={() => setSelectedFile(`file_uploads/${roomName}/${val}`)}>{val}</button>
                    ))}
                </div>
                <div>
                    <FileUploader />
                </div>
                <div>
                    { (selectedFile &&
                    <FileViewer file={selectedFile} />) || (<p>Select a file to view.</p>)}
                </div>
            </div>
        </div>
    );
}

export default FileCollab;
