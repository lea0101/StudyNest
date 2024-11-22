import React, { useState, useEffect } from 'react';
import P5Wrapper from './P5Wrapper';
import './WhiteBoard.css'

import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
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

    const addImage = () => {
        const url = document.getElementById('addImageURLInput').value;
        if (url === '') {
            setErrorMessage('Please enter a valid URL');
            return;
        }
        setNewImageURL(url);
        setImageURL('');
        setShowImageAdd(false);
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
                        <button id="grab" className="selected" onClick={getUpdateToolHandler}>Grab</button>
                        <button id="paint" onClick={getUpdateToolHandler}>Paint</button>
                        <button id="rectangle" onClick={getUpdateToolHandler}>Rectangle</button>
                        <button id="ellipse" onClick={getUpdateToolHandler}>Ellipse</button>
                        <button id="erase" onClick={getUpdateToolHandler}>Erase</button>
                        <button id="clear" onClick={() => setClearEvent(true)}>Clear</button>
                        <button id="select" onClick={getUpdateToolHandler}>Select</button>
                        <button id="image" onClick={() => setShowImageAdd(true)}>Insert Image</button>
                    </div>
                    <div id="color-select" className="single-select no-null-select">
                        <div>
                            {/* <!-- enable fill --> */}
                            <input type="checkbox" id="fill-enable" onChange={(event) => setFill(event.target.checked)} />
                                <label htmlFor="fill">Fill</label>
                        </div>
                        <button id="black" onClick={getUpdateColorHandler} className="default-select"></button>
                        <button id="red" onClick={getUpdateColorHandler}></button>
                        <button id="green" onClick={getUpdateColorHandler}></button>
                        <button id="blue" onClick={getUpdateColorHandler}></button>
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