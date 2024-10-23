import React, { useEffect, useState } from "react"
import '../../App.css';
import NavBar from './NavBar';
import Room from "../Room/Room";
import JoinRoom from "./JoinRoom";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";


import { db } from "../../config/firebase";
import { doc, setDoc, updateDoc, getDoc, query, where, getDocs, collection } from "firebase/firestore";

function HomePage() {
  const [showInput, setShowInput] = useState(false); // show input to create a room
  const [roomName, setRoomName] = useState(''); // name of new room
  const [rooms, setRooms] = useState([]);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate(); // used for routes


  // load in rooms
  useEffect(() => {
    if (loading) {
      return;
    }
    const userDocRef = doc(db, 'users', user.uid);
    getDoc(userDocRef).then(snapshot => {
        if (typeof snapshot.data() !== 'undefined') {
            setRooms(snapshot.data().rooms);
        }
  });}, [loading])


  // save rooms to firebase whenever room state changes
  useEffect(() => {
    if (loading) {
      return;
    }
    if (rooms.length != 0) {
      const userDocRef = doc(db, 'users', user.uid);
      //updateDoc(userDocRef, {rooms: rooms}, {merge: true});
      setDoc(userDocRef,
      {
        rooms: rooms,
        username: user.email,
        displayname: user.displayName,
        icon: user.photoURL
      }, {merge: true});
    }
  }, [rooms, loading]);

  // generate a random room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8);
  }

  // handle the creation of a new room
  const handleCreateRooms = () => {
      if (roomName.trim() !== '') {
        const newRoom = { name: roomName, code: generateRoomCode() };
        setDoc(doc(db, 'rooms', newRoom.code), {name: newRoom.name, code : newRoom.code, owner: user.uid, userList: [user.uid]});
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
     // remove from rooms db
    const roomDocRef = doc(db, 'rooms', roomToDelete.code);
    getDoc(roomDocRef).then(snapshot => {
       if (typeof snapshot.data() !== 'undefined') {
         const priorUserList = snapshot.data().userList;
         const newUserList = priorUserList.filter(userUid => userUid !== user.uid)
         updateDoc(roomDocRef, {userList: newUserList});
       }
    })
     // remove from user db and local storage
    const newList = rooms.filter(room => room.name !== roomToDelete.name || room.code !== roomToDelete.code);
    setRooms(newList);
    // do it one more time here b/c it could be empty, while hook will not let empty lists be set
    const userDocRef = doc(db, 'users', user.uid);
    updateDoc(userDocRef, {rooms: newList}, {merge: true});
  }

  // handle joining an existing room
  const handleJoinRoom = (roomCode) => {
    if (rooms.find(r => r.code === roomCode)) {
      alert("You are already in that room!")
      return
    }
    // check if entered room code exists
    const roomDocRef = doc(db, 'rooms', roomCode);
    getDoc(roomDocRef).then(doc => {
         if (typeof doc.data() !== 'undefined') {
            setRooms([...rooms, { name: doc.data().name, code: doc.data().code }]); // add new room to the list
            const priorUserList = doc.data().userList;
            updateDoc(roomDocRef, {userList: [...priorUserList, user.uid]});
            //setDoc(roomDocRef, {userList: [...priorUserList, user.uid]})
         } else {
            alert("Room does not exist");
         }
    })
    //const q = query(collection(db, "rooms") , where("code", "==", roomCode));
    //var added = false;
    //const querySnapshot = getDocs(q).then(snapshot => {
    //  snapshot.forEach((doc) => {
    //      setRooms([...rooms, { name: doc.data().name, code: doc.data().code }]); // add new room to the list
    //      const priorUserList = doc.data().userList;
    //      setDoc(roomDocRef, {userList: [...priorUserList, user.uid]})
    //      added = true;
    //  })
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
