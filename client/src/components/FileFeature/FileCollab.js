import React, { useState } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../NavBar";
import "./FileCollab.css";

/*
function GetFileList()

    const [files, setFiles] = useState([]);
    const { state } = useLocation();
    const roomName = state?.roomCode;
    console.log(roomName);
    const getItems = () => {
        storage
            .ref()
            .child(`file_uploads/`)
            .listAll()
            .then((res) => {
                res.items.forEach((item) => {
                    setFiles((arr) => [...arr, item.name]);
                    console.log(item.name);
                });
            })
                .catch((err) => {
                    alert(err.message);
              });
    };
    return files;
}
    */

const FileCollab = () => {
    const [ files, setFiles ] = useState([]);
    const { state } = useLocation();
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
                        <button>{val}</button>
                    ))}
                </div>
                <div>
                    <FileUploader/>
                </div>
            </div>
        </div>
    );
}

export default FileCollab;
