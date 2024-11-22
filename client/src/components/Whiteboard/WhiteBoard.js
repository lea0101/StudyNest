import React, { useState, useEffect } from 'react';
import P5Wrapper from './P5Wrapper';
import './WhiteBoard.css'

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import NotAuthorizedPage from "../../Pages/NotAuthorizedPage";

import { useLocation } from 'react-router-dom';


const WhiteBoard = () => {
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    
    const [isAuthorized, setAuthorized] = useState(2);

    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    let [tool, setTool] = useState('grab');
    let [color, setColor] = useState('black');
    let [fill, setFill] = useState(false);
    let [clearEvent, setClearEvent] = useState(false);

    let [errorMessage, setErrorMessage] = useState('');
    let [showImageAdd, setShowImageAdd] = useState(false);
    let [imageURL, setImageURL] = useState('');
    let [newImageURL, setNewImageURL] = useState('');

    const storage = getStorage();

    const isValidP5Image = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                return false; // Invalid URL or inaccessible
            }
        
            const contentType = response.headers.get('Content-Type');
            // Check for common image MIME types
            const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            return validMimeTypes.includes(contentType);
        } catch (error) {
            console.error('Error checking image:', error);
            return false;
        }
    };

    const addImage = async () => {
        // first check if the input is a file
        const fileInput = document.getElementById('addImageFileInput');
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            if (!file.type.startsWith('image/')) {
                setErrorMessage('Invalid file type. Please upload an image file.');
                return;
            }
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    // Initialize Firebase storage
                    const storageRef = await ref(storage, `whiteboard_images/${roomCode}/${file.name}`); // Change 'images/' to your desired path
                    
                    // Upload image as a base64 string
                    const snapshot = await uploadString(storageRef, reader.result, 'data_url');
                    console.log("Upload complete!", snapshot);
    
                    // Get the download URL
                    const downloadURL = await getDownloadURL(storageRef);
                    console.log("File available at:", downloadURL);
    
                    // Optionally, handle the URL (e.g., save it to your database or update the UI)
                    setNewImageURL(downloadURL);
                    setImageURL('');
                    setShowImageAdd(false);
                } catch (error) {
                    console.error("Error uploading file:", error);
                    setErrorMessage('Error uploading file. Please try again.');
                }
            };
            reader.readAsDataURL(file);
            return;
        }

        const url = document.getElementById('addImageURLInput').value;
        if (url === '') {
            setErrorMessage('Please enter a valid URL or upload a file');
            return;
        }
        const img = new Image();
        img.src = url;

        img.onload = () => {
            if (isValidP5Image(url)) {
                setNewImageURL(url);
                setImageURL('');
                setShowImageAdd(false);
            } else {
                setErrorMessage('Invalid URL');
            }
            // setNewImageURL(url);
            // setImageURL('');
            // setShowImageAdd(false);
        };
        img.onerror = () => {
            console.log('this could\'ve been stopped');
            setErrorMessage('Invalid URL');
        };
    }

    useEffect(() => {
        if (loading) {
            return;
        }
        const handleKeyPress = async (event) => {
            if (event.ctrlKey && event.key === 'v') {
                if (!showImageAdd) {
                    event.preventDefault(); // Prevent the default paste behavior
                    // console.log('Custom Ctrl+V behavior triggered');
                    // Call your custom function here
                    const text = await navigator.clipboard.readText();
                    console.log(text);
                    setImageURL(text);
                    setShowImageAdd(true);
                } else {
                    // console.log('Default Ctrl+V behavior allowed');
                }
            }
        };
    
        document.addEventListener('keydown', handleKeyPress);
    
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [loading, showImageAdd]);

    useEffect(() => {
        console.log("useEffect 1");

        if (loading) {
            return;
        }

        if (roomCode == undefined) {
            setAuthorized(1);
            return;
        }
        
        if (user) {
            if (roomCode == undefined) {
                setAuthorized(1);
                return;
            }
            const roomDocRef = doc(db, 'rooms', roomCode);
            getDoc(roomDocRef).then(doc => {
                 if (doc.exists()) {
                    const userList = doc.data().userList || {};
                    const userInList = Object.values(userList).some(userObj => userObj.uid === user.uid);

                    if (userInList) {
                        setAuthorized(0); // set authorized if user is in userList
                    } else {
                        setAuthorized(1);
                    }
                 } else {
                    setAuthorized(1);
                 }
            }).catch(error => {
                console.error("Error fetching room: ", error);
                setAuthorized(1);
            })
        }
    }, [loading]);

    function getUpdateToolHandler(event) {
        setTool(event.target.id);
        let buttons = event.target.parentElement.children;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].id !== event.target.id) {
                buttons[i].classList.remove('selected');
            }
        }
        event.target.classList.add('selected');
    }

    function getUpdateColorHandler(event) {
        setColor(event.target.id);
        let buttons = event.target.parentElement.children;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].id !== event.target.id) {
                buttons[i].classList.remove('selected');
            }
        }
        event.target.classList.add('selected');
    }

    if (isAuthorized == 1) {
        return <NotAuthorizedPage/>
    } else if (isAuthorized == 2){
        return <div> Loading... </div>
    }

    return (
        <>
            <div className="module">
                <div className="toolbar">
                    {/* <div>
                        <button id="undo" onClick={popAction()}>Undo</button>
                        <button id="redo" onClick={pushAction()}>Redo</button>
                    </div> */}
                    <div id="tool-select" className="single-select no-null-select">
                        <button className="selected b-button" id="grab"onClick={getUpdateToolHandler}>Grab</button>
                        <button className="b-button" id="paint" onClick={getUpdateToolHandler}>Paint</button>
                        <button className="b-button" id="rectangle" onClick={getUpdateToolHandler}>Rectangle</button>
                        <button className="b-button" id="ellipse" onClick={getUpdateToolHandler}>Ellipse</button>
                        <button className="b-button" id="erase" onClick={getUpdateToolHandler}>Erase</button>
                        <button className="b-button" id="clear" onClick={() => setClearEvent(true)}>Clear</button>
                        <button className="b-button" id="select" onClick={getUpdateToolHandler}>Select</button>
                        <button className="b-button" id="image" onClick={() => setShowImageAdd(true)}>Insert Image</button>
                    </div>
                    <div id="color-select" className="single-select no-null-select">
                        <div>
                            {/* <!-- enable fill --> */}
                            <input type="checkbox" id="fill-enable" onChange={(event) => setFill(event.target.checked)} />
                                <label htmlFor="fill">Fill</label>
                        </div>
                        <button className="b-button" id="black" onClick={getUpdateColorHandler}></button>
                        <button className="b-button" id="red" onClick={getUpdateColorHandler}></button>
                        <button className="b-button" id="green" onClick={getUpdateColorHandler}></button>
                        <button className="b-button" id="blue" onClick={getUpdateColorHandler}></button>
                    </div>
                </div>
                <P5Wrapper roomCode={roomCode} tool={tool} color={color} fill={fill} clearEvent={clearEvent} setClearEvent={setClearEvent} newImageURL={newImageURL} />
            </div>
            {showImageAdd && (
            <div className="share-overlay">
                <div className="share">
                    <div className="share-modal"
                    // style={{
                    //     "background-color":
                    //         selectedLight === "light"
                    //         ? "white"
                    //         : selectedLight === "dark"
                    //         ? "rgb(69, 67, 63)"
                    //         : "white",                       
                    // }}
                    >
                        <div className="share-content">
                            <input id="addImageURLInput" type="text" defaultValue={imageURL} placeholder='Image URL'/>
                            {/* File input */}
                            <input id="addImageFileInput" type="file" accept="image/*" />
                            <button className='b-button' onClick={addImage}>Insert Image</button>
                            {errorMessage && <p style={{"color": "red"}}>{errorMessage}</p>}
                        </div>
                        <a className="hyperlink" onClick={() => {
                            setShowImageAdd(false);
                            setErrorMessage('');
                        }}>Close</a>
                    </div>
                </div>
            </div>
            )}
        </>
    );
}

export default WhiteBoard;