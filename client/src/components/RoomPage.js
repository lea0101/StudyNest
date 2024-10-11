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

    // toggle for leave
    const handleLeave = () => {
        setShowConfirmation(true);
    }

    // for this user, remove the room from their user data and then navigate to home
    const handleConfirmLeave = () => {
        // remove the room from the rooms list and update local storage
        const updatedRooms = rooms.filter(r => r.name !== roomName || r.code !== roomCode);
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));

        setShowConfirmation(false);
        navigate('/home');
    }

    // toggle for cancel leave
    const handleCancelLeave = () => {
        setShowConfirmation(false);
    }

    // handle when user wants to go to chat
    const handleEnterChat = () => {
        navigate(`/rooms/${roomName}/chat`, { state: {roomCode : roomCode}});
    }

    // handle when user wants to go to whiteboard
    const handleEnterWhiteboard = () => {
        navigate(`/rooms/${roomName}/whiteboard`);
    }

    return (
        <div className="RoomPage">
            <button className="leave-room-button" onClick={handleLeave}>Leave Study Group</button>
            <NavBar />
            <div className="room-header">
                <h1>Welcome to Room {roomName}</h1>
            </div>

            {/* content in the middle */}
            <p>Explore your virtual study room</p>
            <button className="a-button" onClick={handleEnterChat}>Chat</button>
            <button className="a-button" onClick={handleEnterWhiteboard}>Whiteboard</button>
            
            {/* room code displayed on the bottom left and can be copied to clipboard */}
            <div className="room-code">
                <button
                className="b-button"
                onClick={() => {
                    navigator.clipboard.writeText(room.code)
                    .then(() => {
                        alert('Room code copied to clipboard!')
                    })
                    .catch(err => {
                        console.error('Failed to copy room code: ', err);
                    });
                }}
                >
                    Room Code: {room.code}
                </button>
            </div>


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