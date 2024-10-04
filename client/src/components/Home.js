import React, { useState } from "react"
import '../App.css';
import NavBar from './NavBar';

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
            <button className="add-room-button" onClick={() => setShowInput(true)}>+ Create New Room</button>
            {showInput}
        </div>
    </div>
  );
}
export default Home;
