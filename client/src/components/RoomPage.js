import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

function RoomPage() {
    const { roomName } = useParams(); // get room name from url params

    // for this user, remove the room from their user data and then navigate to home
    const navigate = useNavigate();
    
    const handleLeave = () => {
        navigate("/home");
    }

    return (
        <div className="RoomPage">
            <button className="leave-room-button" onClick={handleLeave}>Leave Study Group</button>
            <NavBar />
            <h1>Welcome to {roomName} Room</h1>
            <p>Explore your virtual study room</p>
            {/* more content */}
        </div>
    )
}

export default RoomPage;