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
                getDoc(userDocRef).then(snapshot => {
                    if (typeof snapshot.data() !== 'undefined') {
                        const rooms = snapshot.data().rooms;
                        setDoc(userDocRef, { rooms: [...rooms, { code: roomCode, name: roomName }] }, { merge: true }).then(() => {
                            navigate('/rooms/' + roomName, { state: { roomCode: roomCode }});
                        });
                    }
                });
            });
            // const userDocRef = doc(db, 'users', user.uid);
            // getDoc(userDocRef).then(snapshot => {
            //     if (typeof snapshot.data() !== 'undefined') {
            //         if (snapshot.data().rooms.some(e => e.code === roomCode)) {
            //             setAuthorized(true);
            //         }
            //     }
            // });
        }
    }, [loading]);

}

export default JoinPage;