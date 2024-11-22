import React, { useEffect, useState } from "react"
import '../../App.css';
import NavBar from './NavBar';
import Room from "../Room/Room";
import JoinRoom from "./JoinRoom";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";


import { db } from "../../config/firebase";
import { doc, setDoc, updateDoc, getDoc, query, where, getDocs, collection, onSnapshot } from "firebase/firestore";

function HomePage() {
  const [showInput, setShowInput] = useState(false); // show input to create a room
  const [roomName, setRoomName] = useState(''); // name of new room
  const [rooms, setRooms] = useState([]);

  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate(); // used for routes


  // load in rooms
  useEffect(() => {
    if (loading) return;

    const fetchRooms = async () => {
      try {
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const userRooms = [];

        roomsSnapshot.forEach(doc => {
          const roomData = doc.data();

          // const userListArray = Object.values(roomData.userList || {}).map((userItem) => ({
          //   role: userItem.role,
          //   uid: userItem.uid
          // }));

          // filter userList to exclude deleted users
          const userListArray = Object.values(roomData.userList || {}).filter((userItem) => !userItem.deleted);

          // check if current user is in the room
          const isUserInRoom = userListArray.some(userItem => userItem.uid === user.uid);

          if (isUserInRoom) {
            userRooms.push({ code: roomData.code, name: roomData.name });
          }

          setRooms(userRooms);
        })
      } catch (error) {
        console.error("Error fetching rooms: ", error);
        setRooms([]);
      }
    };

    fetchRooms();
  }, [loading, user]);


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
  // const handleCreateRooms = () => {
  //     if (roomName.trim() !== '') {
  //       const newRoom = { name: roomName, code: generateRoomCode() };
  //       setDoc(doc(db, 'rooms', newRoom.code), {name: newRoom.name, code : newRoom.code, owner: user.uid, userList: [user.uid]});
  //       setRooms([...rooms, newRoom]); // add new room to the list
  //       setRoomName(''); // clear input after adding
  //       setShowInput(!showInput);
  //     }
  // }
  const handleCreateRooms = () => {
    if (roomName.trim() !== '') {
      const newRoom = {
        name: roomName,
        code: generateRoomCode(),
        owner: user.uid, // add owner as the user, assuming user.uid is available
        userList: [ { uid: user.uid, role: "host"} ] // add the creator as the host
      };

      console.log(newRoom.name);
      console.log(newRoom.code);
      console.log(newRoom.owner);
      console.log(newRoom.userList);

      const roomDocRef = doc(db, 'rooms', newRoom.code);
      setDoc(roomDocRef, newRoom)
      .then(() => {
        setRooms((prevRooms) => [...prevRooms, newRoom]);
        setRoomName('');
        setShowInput(!showInput);
      })
      .catch((error) => {
        console.error("Error creating room: ", error);
      })
      // setDoc(doc(db, 'rooms', newRoom.code), newRoom);
      // setRooms([...rooms, newRoom]); // add new room to the list
      // setRoomName(''); // clear input after adding
      // setShowInput(!showInput);
    }
}

  // handle canceling room creation
  const handleCancel = () => {
    setRoomName('');
    setShowInput(false);
  }

  // handle deleting rooms
  // const handleDeleteRoom = (roomToDelete) => {
  //    // remove from rooms db
  //   const roomDocRef = doc(db, 'rooms', roomToDelete.code);
  //   getDoc(roomDocRef).then(snapshot => {
  //      if (typeof snapshot.data() !== 'undefined') {
  //        const priorUserList = snapshot.data().userList;
  //        const newUserList = priorUserList.filter(userUid => userUid !== user.uid)
  //        updateDoc(roomDocRef, {userList: newUserList});
  //      }
  //   })
  //    // remove from user db and local storage
  //   const newList = rooms.filter(room => room.name !== roomToDelete.name || room.code !== roomToDelete.code);
  //   setRooms(newList);
  //   // do it one more time here b/c it could be empty, while hook will not let empty lists be set
  //   const userDocRef = doc(db, 'users', user.uid);
  //   updateDoc(userDocRef, {rooms: newList}, {merge: true});
  // }
  const handleDeleteRoom = (roomToDelete) => {
    // remove from rooms db
  const roomDocRef = doc(db, 'rooms', roomToDelete.code);

  getDoc(roomDocRef).then(snapshot => {
    if (snapshot.exists()) {
      const priorUserList = snapshot.data().userList || [];
      const newUserList = priorUserList.filter(userUid => userUid.uid !== user.uid);

      updateDoc(roomDocRef, { userList: newUserList })
        .then(() => {
          const newList = rooms.filter(room => room.code !== roomToDelete.code);
          setRooms(newList); // update rooms list
          // setRoomName(newList);
          const userDocRef = doc(db, 'users', user.uid);
          updateDoc(userDocRef, { rooms: newList }, {merge: true});
        })
        .catch(error => {
          console.error("Error updating room user list: ", error);
        })
    }

  }).catch(error => {
      console.error("Error fetching rooms: ", error);
    });
 }

  // handle joining an existing room
  // const handleJoinRoom = (roomCode) => {
  //   if (rooms.find(r => r.code === roomCode)) {
  //     alert("You are already in that room!")
  //     return
  //   }
  //   // check if entered room code exists
  //   const roomDocRef = doc(db, 'rooms', roomCode);
  //   getDoc(roomDocRef).then(doc => {
  //        if (typeof doc.data() !== 'undefined') {
  //           setRooms([...rooms, { name: doc.data().name, code: doc.data().code }]); // add new room to the list
  //           const priorUserList = doc.data().userList;
  //           updateDoc(roomDocRef, {userList: [...priorUserList, user.uid]});
  //           //setDoc(roomDocRef, {userList: [...priorUserList, user.uid]})
  //        } else {
  //           alert("Room does not exist");
  //        }
  //   })
    //const q = query(collection(db, "rooms") , where("code", "==", roomCode));
    //var added = false;
    //const querySnapshot = getDocs(q).then(snapshot => {
    //  snapshot.forEach((doc) => {
    //      setRooms([...rooms, { name: doc.data().name, code: doc.data().code }]); // add new room to the list
    //      const priorUserList = doc.data().userList;
    //      setDoc(roomDocRef, {userList: [...priorUserList, user.uid]})
    //      added = true;
    //  })
  const handleJoinRoom = (roomCode) => {
    if (rooms.find(r => r.code === roomCode)) {
      alert("You are already in that room!")
      return
    }

    // check if entered room code exists
    const roomDocRef = doc(db, 'rooms', roomCode);

    getDoc(roomDocRef).then(doc => {
      if (doc.exists()) {
        const roomData = doc.data();

        // const currUserList = Object.values(roomData.userList || {}).map((userItem) => ({
        //   role: userItem.role,
        //   uid: userItem.uid
        // }));
        // filter userList to exclude users marked as deleted
        // const currUserList = Object.values(roomData.userList || {}).filter((userItem) => !userItem.deleted);
        const currUserList = Object.values(roomData.userList || {});

        // check if current user is already in the room
        const userInRoom = currUserList.some((userItem) => userItem.uid === user.uid);
        if (!userInRoom) {
          // add current user to the userList if not already present
          const nextIndex = currUserList.length;
          const updatedUserList = { ...roomData.userList, [nextIndex]: { uid: user.uid, role: "editor" } };

          updateDoc(roomDocRef, { userList: updatedUserList})
          .then(() => {
            setRooms((prevRooms) => [
              ...prevRooms,
              { name: roomData.name, code: roomData.code }
            ]);
          })
          .catch((error) => {
            console.error("Error updating room: ", error);
          })
          
        } else {
          alert("You are already in this room!");
        }

        // const updatedUserList = roomData.userList ? [
        //   ...currUserList,
        //   { uid: user.uid, role: "editor" }
        // ] : [{ role: "editor ", uid: user.uid }]; // default to a new array is userList does not exist

        // updateDoc(roomDocRef, { userList: updatedUserList})
        //   .then(() => {
        //     setRooms((prevRooms) => [
        //       ...prevRooms,
        //       { name: roomData.name, code: roomData.code }
        //     ]);
        //   })
        //   .catch((error) => {
        //     console.error("Error updating room: ", error);
        //   })
      } else {
        alert("Room does not exist!");
      }
    }).catch((error) => {
      console.error("Error fetching room: ", error);
    })
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
          {Array.isArray(rooms) && rooms.length > 0 ? (
            rooms.map((room, index) => (
              <Room key={index} name={room.name} code={room.code} onDelete={handleDeleteRoom} />
            ))
          ) : (
            console.log("")
          )}

        </div>
    </div>
  );
}
export default HomePage;
