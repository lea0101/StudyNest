import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import NotAuthorizedPage from "../Pages/NotAuthorizedPage";


import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";


import { db } from "../config/firebase";
import { doc, setDoc, updateDoc, getDoc, getDocs, where, query, collection ,onSnapshot } from "firebase/firestore";

function RoomPage() {
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    // 3 states of authorization : 0 = logged in 1 = error/unauth 2 = loading
    const [isAuthorized, setAuthorized] = useState(2);
    const [rooms, setRooms] = useState([]);
    const [userList, setUserList] = useState([]);
    const navigate = useNavigate();

    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            if (roomCode == undefined) {
                setAuthorized(1);
                return;
            }
            const roomDocRef = doc(db, 'rooms', roomCode);
            getDoc(roomDocRef).then(doc => {
                 if (typeof doc.data() !== 'undefined') {
                     const userList = doc.data().userList;
                     if (userList.includes(user.uid)) {
                         setAuthorized(0);
                     }
                 }
            });
            //const userDocRef = doc(db, 'users', user.uid);
            //getDoc(userDocRef).then(snapshot => {
            //     if (typeof snapshot.data() !== 'undefined') {
            //         if (snapshot.data().rooms.some(e => e.code === roomCode)) {
            //             setAuthorized(true);
            //         }
            //     }
            //});
        }
    }, [loading]);

    useEffect(() => {
        const q = query(
            collection(db, "rooms"),
            where("code", "==", roomCode)
        );
        const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {
            const fetchedUsersPromises = [];
    
            QuerySnapshot.forEach((d) => {
                d.data().userList.forEach((uid) => {
                    const userPromise = getDoc(doc(db, 'users', uid)).then(snapshot => {
                        return snapshot.data().username;
                    });
                    fetchedUsersPromises.push(userPromise);
                });
            });
    
            const fetchedUsers = await Promise.all(fetchedUsersPromises);
            setUserList(fetchedUsers);
        });
    
        return () => unsubscribe;
    }, []);


    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showShare, setShowShare] = useState(false);

    // toggle for leave
    const handleLeave = () => {
        setShowConfirmation(true);
    }

    // for this user, remove the room from their user data and then navigate to home
    const handleConfirmLeave = () => {
        // remove the room from the rooms list and update local storage
        const updatedRooms = rooms.filter(r => r.name !== roomName || r.code !== roomCode);
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));

        setShowConfirmation(false);
        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef).then(snapshot => {
            if (typeof snapshot.data() !== 'undefined') {
                const updatedRooms = snapshot.data().rooms.filter(room => room.name !== roomName || room.code !== roomCode);
                updateDoc(userDocRef, {rooms: updatedRooms});
            }
        }).then(() => {
            const roomDocRef = doc(db, 'rooms', roomCode);
            getDoc(roomDocRef).then(snapshot => {
                if (typeof snapshot.data() !== 'undefined') {
                    const priorUserList = snapshot.data().userList;
                    const newUserList = priorUserList.filter(userUid => userUid !== user.uid)
                    updateDoc(roomDocRef, {userList: newUserList});
                }
            })
        }).then(() => {
            navigate('/home');
        });
    }

    // toggle for cancel leave
    const handleCancelLeave = () => {
        setShowConfirmation(false);
    }

    // handle when user wants to go to chat
    const handleEnterChat = () => {
        navigate(`/rooms/${roomName}/chat`, { state: {roomCode : roomCode}});
    }

    // handle when user wants to go to whiteboard
    const handleEnterWhiteboard = () => {
        navigate(`/rooms/${roomName}/whiteboard`);
    }

    if (isAuthorized == 1) {
        return <NotAuthorizedPage/>
    } else if (isAuthorized == 2){
        return <div> Loading... </div>
    }
    return  (
         <div className="RoomPage">
            <button className="leave-room-button" onClick={handleLeave}>Leave Study Group</button>
            <NavBar />
            <div className="room-header">
                <h1>Welcome to Room {roomName}</h1>
            </div>
            <div>
                <h2>Users in Room</h2>
                <ul>
                    {userList.map((user, i) => (
                        <li key={i}>{user}</li>
                    ))}
                </ul>
            </div>

            {/* content in the middle */}
            <p>Explore your virtual study room</p>
            <button className="a-button" onClick={handleEnterChat}>Chat</button>
            <button className="a-button" onClick={handleEnterWhiteboard}>Whiteboard</button>

            {/* room code displayed on the bottom left and can be copied to clipboard */}
            <div className="room-code">
                <button
                className="b-button"
                onClick={() => {
                    navigator.clipboard.writeText(roomCode)
                    .then(() => {
                        alert('Room code copied to clipboard!')
                    })
                    .catch(err => {
                        console.error('Failed to copy room code: ', err);
                    });
                }}
                >
                    Room Code: {roomCode}
                </button>
                <button className="a-button" onClick={() => setShowShare(true)}>Share</button>
            </div>

            {showShare && (
                <div className="share-overlay">
                    <div className="share">
                        <div className="share-modal">
                            <div className="share-content">
                                <p>Share this room with your friends!</p>
                                <input type="text" value={`http://localhost:3000/join/${roomCode}`} readOnly />
                                <button
                                    className="b-button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`http://localhost:3000/join/${roomCode}`)
                                            .then(() => {
                                                alert('Link copied to clipboard!')
                                            })
                                            .catch(err => {
                                                console.error('Failed to copy link: ', err);
                                            });
                                    }}
                                >
                                    Copy
                                </button>
                            </div>
                            <a className="hyperlink" onClick={() => setShowShare(false)}>Close</a>
                        </div>
                    </div>
                </div>
            )}


            {showConfirmation && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <p>Are you sure you want to leave the group?</p>
                        <button className="confirm-leave-button" onClick={handleConfirmLeave}>Leave</button>
                        <button className="cancel-leave-button" onClick={handleCancelLeave}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    ) }

export default RoomPage;
