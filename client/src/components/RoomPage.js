import React from 'react';
import { useParams } from 'react-router-dom';

function RoomPage() {
    const { roomName } = useParams(); // get room name from url params

    console.log("Room Name:", roomName); // for debugging

    return (
        <div className="RoomPage">
            <h1>Welcome to {roomName} Room</h1>
            {/* more content */}
        </div>
    )
}

export default RoomPage;