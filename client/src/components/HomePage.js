import React, { useEffect, useState } from "react"
import '../App.css';
import NavBar from './NavBar';
import Room from "./Room";
import JoinRoom from "./JoinRoom";
import { useNavigate } from "react-router-dom";

function HomePage() {
  // set initial rooms from LocalStorage, holds list of rooms
  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem('rooms');
    const initivalValue = JSON.parse(saved);
    return initivalValue || [];
  });

  const [showInput, setShowInput] = useState(false); // show input to create a room
  const [roomName, setRoomName] = useState('') // name of new room
  const [joinRoomInput, setJoinRoomInput] = useState(false); // to join an existing room
  const [showJoinInput, setShowJoinInput] = useState(false); // toggles input field for joining a room

  const navigate = useNavigate(); // used for routes

  // save rooms to LocalStorage whenever room state changes
  useEffect(() => {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  }, [rooms]);

  // handle the creation of a new room
  const handleCreateRooms = () => {
      if (roomName.trim() !== '') {
          setRooms([...rooms, roomName]); // add new room to the list
          setRoomName(''); // clear input after adding
          setShowInput(!showInput);
      }
  }

  // handle deleting rooms
  const handleDeleteRoom = (roomToDelete) => {
    setRooms(rooms.filter(room => room !== roomToDelete));
  }

  // handle joining an existing room
  const handleJoinRoom = () => {
    // check if entered room code exists
    if (rooms.include()) {

    }
  }

  return (
    <div className="HomePage">
        <NavBar />
        <h1>StudyNest Home Page</h1>

        <div>
          <JoinRoom />
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
            <Room key={index} name={room} onDelete={handleDeleteRoom} />
          ))}

        </div>
    </div>
  );
}
export default HomePage;
