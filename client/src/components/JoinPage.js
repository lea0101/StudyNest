import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';


import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";


import { db } from "../config/firebase";
import { doc, setDoc, getDoc, getDocs, query, collection, where } from "firebase/firestore";

function JoinPage() {
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    const [isAuthorized, setAuthorized] = useState(false);
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    const { roomCode } = useParams(); // get room name from url params

    useEffect(() => {
        if (loading) {
            return;
        }
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const q = query(collection(db, "rooms"), where("code", "==", roomCode));
            const roomDocRef = doc(db, 'rooms', roomCode);
            getDocs(q).then(snapshot => {
                let ret;
                snapshot.forEach((doc) => {
                    ret = doc.data().name;
                });
                return ret;
            }).then(roomName => {
                if (typeof roomName === 'undefined') {
                    navigate('/invalidinvite');
                    return;
                }
                getDoc(roomDocRef).then(snapshot => {
                    if (typeof snapshot.data() !== 'undefined') {
                        // const userList = snapshot.data().userList;
                        // setDoc(roomDocRef, { userList: [...userList, user.uid] }, { merge: true });
                        const userList = snapshot.data().userList || {};
                        const userInRoom = Object.values(userList).some(userEntry => userEntry.uid === user.uid); // check if user is already in the room

                        if (!userInRoom) {
                            // add user to userList
                            const nextIndex = Object.keys(userList).length;
                            userList[nextIndex] = { role: 'editor', uid: user.uid};

                            // update room document with new user
                            setDoc(roomDocRef, { userList }, { merge: true });
                        }
                        
                    }
                }).then(() => {
                getDoc(userDocRef).then(snapshot => {
                    if (typeof snapshot.data() !== 'undefined') {
                        // const rooms = snapshot.data().rooms;
                        // setDoc(userDocRef, { rooms: [...rooms, { code: roomCode, name: roomName }] }, { merge: true }).then(() => {
                        //     navigate('/rooms/' + roomName, { state: { roomCode: roomCode }});
                        // });

                        const rooms = snapshot.data().rooms || [];
                        const roomExists = rooms.some(room => room.code === roomCode);

                        if (!roomExists) {
                            // add room to the user's rooms
                            setDoc(userDocRef, { rooms: [...rooms, { code: roomCode, name: roomName }] }, { merge: true }).then(() => {
                                navigate('/rooms/' + roomName, { state: { roomCode }});
                            })
                        } else {
                            navigate('/rooms/' + roomName, { state: { roomCode }});
                        }
                    }
                });
                });
            });
        }
    }, [loading]);

}

export default JoinPage;
