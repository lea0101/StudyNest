import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';


import { getAuth } from "firebase/auth";


import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

function RoomPage() {
    const auth = getAuth();
    const user = auth.currentUser;

    const userDocRef = doc(db, 'users', user.uid);

    const navigate = useNavigate();

    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    const [showConfirmation, setShowConfirmation] = useState(false);

    // for this user, remove the room from their user data and then navigate to home
    const handleLeave = () => {
        setShowConfirmation(true);
    }

    const handleConfirmLeave = () => {
        setShowConfirmation(false);
        getDoc(userDocRef).then(snapshot => {
            if (typeof snapshot.data() !== 'undefined') {
                const updatedRooms = snapshot.data().rooms.filter(room => room.name !== roomName || room.code !== roomCode);
                setDoc(userDocRef, {rooms: updatedRooms});
            }
        }).then(() => {
            navigate('/home');
        });

    }

    const handleCancelLeave = () => {
        setShowConfirmation(false);
    }

    const handleEnterChat = () => {
        navigate(`/rooms/${roomName}/chat`, { state: {roomCode : roomCode}});
    }

    return (
        <div className="RoomPage">
            <button className="leave-room-button" onClick={handleLeave}>Leave Study Group</button>
            <NavBar />
            <div className="room-header">
                <h1>Welcome to Room {roomName}</h1>
            </div>

            <p>Explore your virtual study room</p>
            <button className="chat-button" onClick={handleEnterChat}>Enter Chat</button>
            {/* <ChatPage /> */}
            

            <div className="room-code">
                <p>Room Code: {roomCode}</p>
            </div>

            {/* more content */}

            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <p>Are you sure you want to leave the group?</p>
                        <button className="confirm-leave-button" onClick={handleConfirmLeave}>Leave</button>
                        <button className="cancel-leave-button" onClick={handleCancelLeave}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RoomPage;
