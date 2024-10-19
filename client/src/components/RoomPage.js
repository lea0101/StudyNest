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

    const [userRole, setUserRole] = useState('');

    // useEffect(() => {
    //     if (loading) {
    //         return;
    //     }
    //     if (user) {
    //         if (roomCode == undefined) {
    //             setAuthorized(1);
    //             return;
    //         }
    //         const roomDocRef = doc(db, 'rooms', roomCode);
    //         getDoc(roomDocRef).then(doc => {
    //              if (typeof doc.data() !== 'undefined') {
    //                  const userList = doc.data().userList;
    //                  if (userList.includes(user.uid)) {
    //                      setAuthorized(0);
    //                  }
    //              }
    //         });
    //         //const userDocRef = doc(db, 'users', user.uid);
    //         //getDoc(userDocRef).then(snapshot => {
    //         //     if (typeof snapshot.data() !== 'undefined') {
    //         //         if (snapshot.data().rooms.some(e => e.code === roomCode)) {
    //         //             setAuthorized(true);
    //         //         }
    //         //     }
    //         //});
    //     }
    // }, [loading]);
    useEffect(() => {
        console.log("useEffect 1");

        if (loading) {
            return;
        }

        if (roomCode == undefined) {
            setAuthorized(1);
            return;
        }
        
        if (user) {
            if (roomCode == undefined) {
                setAuthorized(1);
                return;
            }
            const roomDocRef = doc(db, 'rooms', roomCode);
            getDoc(roomDocRef).then(doc => {
                 if (doc.exists()) {
                    const userList = doc.data().userList || {};
                    const userInList = Object.values(userList).some(userObj => userObj.uid === user.uid);

                    if (userInList) {
                        setAuthorized(0); // set authorized if user is in userList
                    } else {
                        setAuthorized(1);
                    }
                 } else {
                    setAuthorized(1);
                 }
            }).catch(error => {
                console.error("Error fetching room: ", error);
                setAuthorized(1);
            })
        }
    }, [loading]);

    // useEffect(() => {
    //     const q = query(
    //         collection(db, "rooms"),
    //         where("code", "==", roomCode)
    //     );
    //     const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {
    //         const fetchedUsersPromises = [];
    
    //         QuerySnapshot.forEach((d) => {
    //             d.data().userList.forEach((uid) => {
    //                 const userPromise = getDoc(doc(db, 'users', uid)).then(snapshot => {
    //                     return snapshot.data().username;
    //                 });
    //                 fetchedUsersPromises.push(userPromise);
    //             });
    //         });
    
    //         const fetchedUsers = await Promise.all(fetchedUsersPromises);
    //         setUserList(fetchedUsers);
    //     });
    
    //     return () => unsubscribe;
    // }, []);
    /* listen to changes in Firestore rooms collection for a specific roomCode, fetch userList from room document, and retreiev each user's username from users collection, and update userList with these usernames */
    useEffect(() => {
        console.log("useEffect 2");

        if (!roomCode) return;

        const q = query(
            collection(db, "rooms"),
            where("code", "==", roomCode)
        );

        const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {
            const fetchedUsersPromises = [];
            const usersWithRoles = []; // store users with their roles
    
            QuerySnapshot.forEach((d) => {
                const userList = d.data().userList || {};
                console.log('userList: ', userList);

                if (userList) {
                    Object.values(userList).forEach((userObj) => {
                        const uid = userObj.uid;
                        console.log('userObj:', userObj);
                        console.log('uid: ', uid);
                        console.log('user.uid', user.uid);

                        if (uid === user.uid) {
                            // if current user is in the userList
                            setUserRole(userObj.role);
                        }
                        console.log('role: ', userRole);
                        usersWithRoles.push({
                            uid: uid,
                            role: userObj.role
                        });
                        console.log(userList);

                        // fetch username (aka email) from the 'users' collection
                        const userPromise = getDoc(doc(db, 'users', uid))
                            .then(snapshot => {
                                return snapshot.data().username;
                            })
                            .catch(error => {
                                console.error('Error fetching user data: ', error);
                                return 'Unknown User';
                            });

                        fetchedUsersPromises.push(userPromise);
                    });
                }
            });
    
            const fetchedUsers = await Promise.all(fetchedUsersPromises); // wait for all usernames to be fetched

            // combine fetched usernames with usersWithRoles
            const updatedUserList = usersWithRoles.map((userWithRole, index) => ({
                ...userWithRole,
                username: fetchedUsers[index]
            }));

            // set userList with both usernames and roles
            console.log('fetchedUsers: ', fetchedUsers);
            console.log('usersWithRoles: ', usersWithRoles);
            console.log('updatedUserList: ', updatedUserList);
            console.log('userList: ', userList);

            setUserList(updatedUserList);
            console.log('Updated User List: ', userList);
        });
    
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        }
    }, [roomCode]);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

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

    // handle opening and closing of the room settings modal
    const handleOpenRoomSettings = () => {
        setShowSettings(true);
    }

    const handleCloseRoomSettings = () => {
        setShowSettings(false);
    }

    // handle when user wants to go to chat
    const handleEnterChat = () => {
        navigate(`/rooms/${roomName}/chat`, { state: {roomCode : roomCode}});
    }

    // handle when user wants to go to whiteboard
    const handleEnterWhiteboard = () => {
        navigate(`/rooms/${roomName}/whiteboard`);
    }

    // handle when user wants to go to fire sharing
    const handleEnterFileSharing = () => {
        navigate(`/rooms/${roomName}/file`);
    }

    // handle when user wants to go to video streaming
    const handleEnterVideo = () => {
        navigate(`/rooms/${roomName}/video`);
    }

    // handle role change
    const handleRoleChange = async (userItem, newRole) => {
        const roomRef = doc(db, 'rooms', roomCode);

        try {
            const roomDoc = await getDoc(roomRef);
            if (roomDoc.exists()) {
                const data = roomDoc.data();
                const currentUserList = data.userList;
                console.log('currentUserList: ', currentUserList);

                const userIndex = Object.keys(currentUserList).findIndex(
                    (key) => currentUserList[key].uid === userItem.uid
                );

                if (userIndex !== -1) {
                    currentUserList[userIndex].role = newRole;

                    await updateDoc(roomRef, {userList: currentUserList});
                } else {
                    console.error('User not found in userList');
                }
            } else {
                console.error('Room document does not exist');
            }
        } catch (error) {
            console.error('Error updating role: ', error);
        }
    };

    if (isAuthorized == 1) {
        return <NotAuthorizedPage/>
    } else if (isAuthorized == 2){
        return <div> Loading... </div>
    }

    return  (
         <div className="RoomPage">
            <button className="room-settings-button" onClick={handleOpenRoomSettings}>Room Settings</button>
            <button className="leave-room-button" onClick={handleLeave}>Leave Study Group</button>
            <NavBar />
            <div className="room-header">
                <h1>Welcome to Room {roomName}</h1>
            </div>
            <div>
                <h2>Users in Room</h2>
                <ul>
                    {userList.map((user, i) => (
                        // <li key={i}>{user}</li>
                        <li key={i}>{user.username}</li>
                    ))}
                </ul>
            </div>

            {/* content in the middle */}
            <p>Explore your virtual study room</p>
            <button className="a-button" onClick={handleEnterChat}>Chat</button>
            <button className="a-button" onClick={handleEnterWhiteboard}>Whiteboard</button>
            <button className="a-button" onClick={handleEnterFileSharing}>File Sharing</button>
            <button className="a-button" onClick={handleEnterVideo}>Video Streaming</button>

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

            {showSettings && (
                <div className="confirmation-modal">
                    <div className="confirmation-content">
                        <div className="settings-header">
                            <h2>Room Settings</h2>
                        </div>
                        <div>
                            <h3>Manage Users</h3>
                            {userRole && (
                                <h4>
                                    {userRole === 'host' && 'You are a Host'}
                                    {userRole === 'editor' && 'You are an Editor'}
                                    {userRole === 'viewer' && 'You are a Viewer'}
                                </h4>
                            )}

                            <ul className="user-settings-list">
                                {userList.map((userItem, i) => (
                                    <li key={i} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            marginBottom: '6px'
                                            }}>
                                        <span style={{ width: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userItem.username}</span>
                                        <span style={{width: '100px'}}>{userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)}</span>
                                        {/* only show the dropdown if the user is a host */}
                                        {userRole === 'host' && userItem.uid !== user.uid ? (
                                            <>
                                                <select
                                                className="user-role-dropdown"
                                                onChange={(e) => handleRoleChange(userItem, e.target.value.toLowerCase())}
                                                >
                                                    <option value="Editor">Editor</option>
                                                    <option value="Viewer">Viewer</option>
                                                </select>
                                                <button
                                                    className="remove-access-button"
                                                    // onClick={() => handleRemoveAccess(user)}
                                                >
                                                    Remove Access
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ marginLeft: '3px'}}>
                                                {/* {userItem.role === 'host' ? 'Host' : userItem.role.charAt(0).toUpperCase() + userItem.role.slice(1)} */}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                            <button className="a-button" onClick={handleCloseRoomSettings}>Save</button>
                            <button className="b-button" onClick={handleCloseRoomSettings}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    ) }

export default RoomPage;
