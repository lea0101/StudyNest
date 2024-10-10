import React, { useState } from "react";

function JoinRoom( {onJoinRoom} ) {
    const [showInput, setShowInput] = useState(false);
    const [roomCode, setRoomCode] = useState('');

    // toggle input field visibility
    const handleJoinClick = () => {
        setShowInput(!showInput);
    };

    // call function to join room when user submits code
    const handleJoinRoom = () => {
        if (roomCode.trim() !== '') {
            onJoinRoom(roomCode);
        } else {
            alert('This room code is incorrect or does not exist.')
        }
    }

    return (
        <div className="join-room">
            <button className="join-room-button" onClick={handleJoinClick}>
                {showInput ? 'Cancel' : 'Join a Room'}
            </button>

            {/* input field for entering room code, conditional */}
            {showInput && (
                <div className="join-room-input">
                    <input
                        type="text"
                        placeholder="Enter room code"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                    />
                    <button className="submit-code-button" onClick={handleJoinRoom}>
                        Join
                    </button>
                </div>
            )}
        </div>
        
    );
}

export default JoinRoom;