import React, { useEffect, useState } from "react"
import '../App.css';
import NavBar from './NavBar';
import Room from "./Room";
import JoinRoom from "./JoinRoom";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

function HomePage() {
  const navigate = useNavigate(); // used for routes

  // set initial rooms from LocalStorage, holds list of rooms
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('rooms');
    const initivalValue = JSON.parse(saved);
    return initivalValue || [];
  });

  const [showInput, setShowInput] = useState(false); // show input to create a room
  const [roomName, setRoomName] = useState('') // name of new room

  // save rooms to LocalStorage whenever room state changes
  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  // generate a random room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8);
  }

  // handle the creation of a new room
  const handleCreateRooms = () => {
      if (roomName.trim() !== '') {
        const newRoom = { name: roomName, code: generateRoomCode() };
        setRooms([...rooms, newRoom]); // add new room to the list
        setRoomName(''); // clear input after adding
        setShowInput(!showInput);
      }
  }

  // handle canceling room creation
  const handleCancel = () => {
    setRoomName('');
    setShowInput(false);
  }

  // handle deleting rooms
  const handleDeleteRoom = (roomToDelete) => {
    setRooms(rooms.filter(room => room.name !== roomToDelete.name || room.code !== roomToDelete.code));
  }

  // handle joining an existing room
  const handleJoinRoom = (roomCode) => {
    // check if entered room code exists
    const room = rooms.find(r => r.code === roomCode);
    if (room) {
      navigate(`/rooms/${room.name}`);
    } else {
      alert('Room code not found!');
    }
  }


  return (
    <div className="HomePage">
        <NavBar />
         <h1>Welcome {user?.displayName}</h1>
        <h2>Your Rooms</h2>

        <div>
          <JoinRoom onJoinRoom={handleJoinRoom}/>
        </div>

        <div className="room-grid">
          {/* input for creating a new room */}
          {showInput && (
            <div className="new-room-input">
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <button className="room-input-button" onClick={handleCreateRooms}>Add Room</button>
                <button className="cancel-button" onClick={handleCancel}>Cancel</button>
            </div>
          )}
          
          {/* button to show input */}
          {!showInput && (
            <button className="add-room-button" onClick={() => setShowInput(true)}>
              + Create New Room
            </button>
          )}

          {/* list of rooms */}
          {rooms.map((room, index) => (
            <Room key={index} name={room.name} code={room.code} onDelete={handleDeleteRoom} />
          ))}

        </div>
    </div>
  );
}
export default HomePage;
