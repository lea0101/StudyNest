import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';


import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";


import { db } from "../../config/firebase";
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
            const roomDocRef = doc(db, 'rooms', roomCode);
    
            getDoc(roomDocRef).then(async (roomSnapshot) => {
                if (!roomSnapshot.exists()) {
                    navigate('/invalidinvite');
                    return;
                }
    
                const roomData = roomSnapshot.data();
    
                // Filter existing userList to exclude deleted users
                const userList = { ...roomData.userList };
    
                // Add the current user if not already in the userList
                const userInRoom = Object.values(userList).some(entry => entry.uid === user.uid);
                if (!userInRoom) {
                    const nextIndex = Object.keys(userList).length;
                    userList[nextIndex] = { role: 'editor', uid: user.uid };
                }
    
                // Update the room document
                await setDoc(roomDocRef, { userList }, { merge: true });
    
                // Update the user's document with the room information
                const userSnapshot = await getDoc(userDocRef);
                const userRooms = (userSnapshot.data().rooms || []).filter(
                    room => room.code !== roomCode
                );
                await setDoc(userDocRef, { rooms: [...userRooms, { code: roomCode, name: roomData.name }] }, { merge: true });
    
                // Navigate to the room
                navigate('/rooms/' + roomData.name, { state: { roomCode } });
            });
        }
    }, [loading]);
    

    // useEffect(() => {
    //     if (loading) {
    //         return;
    //     }
    //     if (user) {
    //         const userDocRef = doc(db, 'users', user.uid);
    //         const q = query(collection(db, "rooms"), where("code", "==", roomCode));
    //         const roomDocRef = doc(db, 'rooms', roomCode);

    //         getDocs(q).then(snapshot => {
    //             let ret;
    //             snapshot.forEach((doc) => {
    //                 ret = doc.data().name;
    //             });
    //             return ret;
    //         }).then(roomName => {
    //             if (typeof roomName === 'undefined') {
    //                 navigate('/invalidinvite');
    //                 return;
    //             }

    //             getDoc(userDocRef).then(async (userSnapshot) => {
    //                 if (userSnapshot.exists()) {
    //                     const userData = userSnapshot.data();

    //                     // check if user is marked as deleted
    //                     if (userData.deleted) {
    //                         navigate('/invalidinvite');
    //                         return;
    //                     }

    //                     // proceed if user is not deleted
    //                     const roomSnapshot = await getDoc(roomDocRef);
    //                     if (roomSnapshot.exists()) {
    //                         const roomData = roomSnapshot.data();

    //                         const userListEntries = Object.values(roomData.userList || {});
    //                         const filteredUserList = {};

    //                         for (const [index, entry] of userListEntries.entries()) {
    //                             const userRef = doc(db, "users", entry.uid);
    //                             const userDoc = await getDoc(userRef);

    //                             console.log("userDoc.data(): ", userDoc.data());

    //                             // only add users who are not deleted
    //                             if (!userDoc.exists() || !userDoc.data().deleted) {
    //                                 filteredUserList[index] = entry;
    //                             }
    //                         }

    //                         const userInRoom = Object.values(filteredUserList).some(userEntry => userEntry.uid === user.uid);
    //                         // filter out deleted users from existing userList

    //                         if (!userInRoom) {
    //                             // add user to userList only if they are not marked as deleted
    //                             const nextIndex = Object.keys(filteredUserList.length);
    //                             filteredUserList[nextIndex] = { role: 'editor', uid: true }
    //                         }

    //                         // update room document
    //                         await setDoc(roomDocRef, { userList: filteredUserList }, { merge: true });
    //                     }

    //                     // update user's document with the room information
    //                     const userRooms = (userSnapshot.data().rooms || []).filter(room => room.code !== roomCode);
    //                     await setDoc(userDocRef, { rooms: [...userRooms, { code: roomCode, name: roomName }] }, { merge: true });

    //                     // navigate to the room
    //                     navigate('/rooms/' + roomName, { state: { roomCode }});
                        
    //                 }
    //             });

    //             // getDoc(roomDocRef).then(snapshot => {
    //             //     if (typeof snapshot.data() !== 'undefined') {
    //             //         const userList = snapshot.data().userList || {};
    //             //         const userInRoom = Object.values(userList).some(userEntry => userEntry.uid === user.uid); // check if user is already in the room

    //             //         if (!userInRoom) {
    //             //             // add user to userList
    //             //             const nextIndex = Object.keys(userList).length;
    //             //             userList[nextIndex] = { role: 'editor', uid: user.uid};

    //             //             // update room document with new user
    //             //             setDoc(roomDocRef, { userList }, { merge: true });
    //             //         }
                        
    //             //     }
    //             // }).then(() => {
    //             // getDoc(userDocRef).then(snapshot => {
    //             //     if (typeof snapshot.data() !== 'undefined') {

    //             //         const rooms = snapshot.data().rooms || [];
    //             //         const roomExists = rooms.some(room => room.code === roomCode);

    //             //         if (!roomExists) {
    //             //             // add room to the user's rooms
    //             //             setDoc(userDocRef, { rooms: [...rooms, { code: roomCode, name: roomName }] }, { merge: true }).then(() => {
    //             //                 navigate('/rooms/' + roomName, { state: { roomCode }});
    //             //             })
    //             //         } else {
    //             //             navigate('/rooms/' + roomName, { state: { roomCode }});
    //             //         }
    //             //     }
    //             // });
    //             // });
    //         });
    //     }
    // }, [loading]);

}

export default JoinPage;
