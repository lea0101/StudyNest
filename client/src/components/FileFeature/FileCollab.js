import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { storage, auth } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import FileViewer from "./FileViewer";
import NavBar from "../Home/NavBar";
import "./FileCollab.css";
import "../../App.css";
import { useRoomSettings } from "../Room/RoomSettingsContext";
import { useTimer } from "../Timer/TimerContext";

const FileCollab = () => {
    const { selectedColor, selectedLight, contextUserRole } = useRoomSettings(); // access color & light and user role settings
    const { isTimerDone, isActive, resetTimerStatus } = useTimer(); // access timer

    const backgroundColor = selectedLight === "light" ? "rgb(255, 253, 248)" : "rgb(69, 67, 63)"; // add at the top
    


    const [ files, setFiles ] = useState([]);
    const { state } = useLocation();
    const [ selectedFile, setSelectedFile ] = useState('');
    const roomName = state?.roomCode;
    const [ shouldUpdate, setShouldUpdate ] = useState(true);
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const loadFilesHandler = useCallback(() => {
        const getFileList = async () => {
            const storageRef = await ref(storage, `file_uploads/${roomName}`);
            const result = await listAll(storageRef);
            const urlPromises = result.items.map((data) => data.name);
            return Promise.all(urlPromises);
        }

        const getFiles = async () => {
            const urls = await getFileList();
            setFiles(urls);
        }
        getFiles().then(() => {
            setShouldUpdate(!shouldUpdate);
        });
    }, []);

    useEffect(() => {
        loadFilesHandler();
    }, []);

    useEffect(() => {
    }, [files, shouldUpdate]);

    return (
        <div className="module" 
            style={{
                "backgroundColor": backgroundColor, 
                "color": selectedLight === "light" ? "black" : "white"
            }}
        >
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
