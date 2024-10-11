import React from 'react';
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
// import ChatPage from './chat/ChatPage';

function RoomPage() {
    const navigate = useNavigate();

    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;
    const rooms = JSON.parse(localStorage.getItem('rooms')) || [];
    const room = rooms.find(r => r.name === roomName);

    const [showConfirmation, setShowConfirmation] = useState(false);

    // for this user, remove the room from their user data and then navigate to home
    const handleLeave = () => {
        setShowConfirmation(true);
    }

    const handleConfirmLeave = () => {
        setShowConfirmation(false);
        navigate('/home');
    }

    const handleCancelLeave = () => {
        setShowConfirmation(false);
    }

    const handleEnterChat = () => {
        navigate('/rooms/3/chat'); // hard coded  ...
    }

    const handleEnterWhiteBoard = () => {
        navigate('/rooms/3/whiteboard'); // hard coded  ...
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
            <button className="chat-button" onClick={handleEnterWhiteBoard}>Enter WhiteBoard</button>
            {/* <ChatPage /> */}
            

            <div className="room-code">
                <p onClick={() => navigator.clipboard.writeText(roomCode)}>Room Code: {roomCode}</p>
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