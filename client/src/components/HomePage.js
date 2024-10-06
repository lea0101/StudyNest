import React, { useState } from "react"
import '../App.css';
import NavBar from './NavBar';
import Room from "./Room";

function Home() {
  const [rooms, setRooms] = useState([]); // holds list of rooms
  const [showInput, setShowInput] = useState(false);
  const [roomName, setRoomName] = useState('') // name of new room

  const handleCreateRooms = () => {
      if (roomName.trim() !== '') {
          setRooms([...rooms, roomName]); // add new room to the list
          setRoomName(''); // clear input after adding
          setShowInput(false);
      }
  }

  return (
    <div className="Home">
        <NavBar />
        <h1>StudyNest Home Page</h1>
        <div className="Rooms">

          {/* input for creating a new room */}
          {showInput && (
            <div className="new-room-input">
                <input
                  type="text"
                  placeholder="Enter room name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <button className="room-input" onClick={handleCreateRooms}>Add Room</button>
            </div>
          )}
          
          {/* button to show input */}
          {!showInput && (
            <button className="add-room-button" onClick={() => setShowInput(true)}>
              + Create New Room
            </button>
          )}

          {/* list of rooms */}
          <div className="room-list">
            {rooms.map((room, index) => (
              <Room key={index} name={room} /> // render room component for each room
            ))}
          </div>

          {/* display list of rooms */}
          {/* <div className="room-list">
            <h3>Room List:</h3>
            <ul>
              {rooms.map((room, index) => (
                <li key={index}>{room}</li> // Print each room
              ))}
            </ul>
          </div> */}

        </div>
    </div>
  );
}
export default Home;
