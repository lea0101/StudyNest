import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from './NavBar';

function RoomPage() {
    const { roomName } = useParams(); // get room name from url params

    console.log("Room Name:", roomName); // for debugging

    return (
        <div className="RoomPage">
            <NavBar />
            <h1>Welcome to {roomName} Room</h1>
            <p>Explore your virtual study room</p>
            {/* more content */}
        </div>
    )
}

export default RoomPage;