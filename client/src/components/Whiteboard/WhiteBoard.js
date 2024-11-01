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

    let [tool, setTool] = useState('ellipse');
    let [color, setColor] = useState('black');
    let [fill, setFill] = useState(false);
    let [clearEvent, setClearEvent] = useState(false);

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
        <div className="module">
            <div className="toolbar">
                {/* <div>
                    <button id="undo" onClick={popAction()}>Undo</button>
                    <button id="redo" onClick={pushAction()}>Redo</button>
                </div> */}
                <div id="tool-select" className="single-select no-null-select">
                    <button id="paint" onClick={getUpdateToolHandler} className="default-select">Paint</button>
                    <button id="rectangle" onClick={getUpdateToolHandler}>Rectangle</button>
                    <button id="ellipse" onClick={getUpdateToolHandler}>Ellipse</button>
                    <button id="erase" onClick={getUpdateToolHandler}>Erase</button>
                    <button id="erase" onClick={() => setClearEvent(true)}>Clear</button>
                    <button id="select" className="default-select" onClick={getUpdateToolHandler}>Select</button>
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
            <P5Wrapper roomCode={roomCode} tool={tool} color={color} fill={fill} clearEvent={clearEvent} setClearEvent={setClearEvent}/>
        </div>
    );
}

export default WhiteBoard;