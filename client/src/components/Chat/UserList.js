import React, { useRef,useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { auth } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../../config/firebase";
import { doc, setDoc, updateDoc, getDoc, getDocs, where, query, collection ,onSnapshot } from "firebase/firestore";
import "./UserList.css";

//TODO add clear checkboxes upon sending pinged message

const UserList = ({addPing, removePing, roomCode}) => {
    const [userList, setUserList] = useState([]);
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);

    /* listening to changes to determine whether a user is authorized to access a specific room */
    useEffect(() => {
        console.log("useEffect 1");
        if (loading) {
            return;
        }
        if (user) {
            const roomDocRef = doc(db, 'rooms', roomCode);
            console.log("Buh>???")
            getDoc(roomDocRef).then(doc => {
                 if (doc.exists()) {
                    const userList = doc.data().userList || {};
                 }
            }).catch(error => {
                console.error("Error fetching room: ", error);
            })
        }
    }, [loading]);

    /* listen to changes in Firestore rooms collection for a specific roomCode, fetch userList from room document, and retrieve each user's username from users collection, and update userList with these usernames */
    useEffect(() => {
        if (!roomCode) return;
        const q = query(
            collection(db, "rooms"),
            where("code", "==", roomCode)
        );

        const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {
            const fetchedUsersPromises = [];
            const usersWithRoles = []; 
            QuerySnapshot.forEach((d) => {
                const userList = d.data().userList || {};

                if (userList) {
                    Object.values(userList).forEach((userObj) => {
                        const uid = userObj.uid;
                        usersWithRoles.push({
                            uid: uid
                        });
                        // fetch username (aka email) from the 'users' collection
                        const userPromise = getDoc(doc(db, 'users', uid))
                            .then(snapshot => {
                                // if no display name, use the email
                                const displayName = snapshot.data().displayname ? snapshot.data().displayname : snapshot.data().username;
                                return [snapshot.data().username, displayName];
                            })
                            .catch(error => {
                                console.error('Error fetching user data: ', error);
                                return [null, 'Unknown User'];
                            });
                        fetchedUsersPromises.push(userPromise);
                    });
                }
            });
            const fetchedUsers = await Promise.all(fetchedUsersPromises); // wait for all usernames to be fetched

            // combine fetched usernames with usersWithRoles
            const updatedUserList = usersWithRoles.map((userWithRole, index) => ({
                ...userWithRole,
                email: fetchedUsers[index][0],
                displayName: fetchedUsers[index][1]
            }));

            setUserList(updatedUserList.filter(u => u.uid != user.uid));
        });
    }, []);

    function onCheck (e) {
        let isChecked = e.target.checked;
        if (isChecked) {
            addPing(e.target.attributes.email.value);
        }
        else {
            removePing(e.target.attributes.email.value);
        }
    }

    return (
        <div className="listContainer">
            <div>  Ping <FontAwesomeIcon icon={faBell}/>
            </div>
            {userList.map((user, i) => (
                // <li key={i}>{user}</li>
                <label className="listLabel" key={i}>
                    <input className="checkbox" type="checkbox" onChange={e => onCheck(e)} email={user.email} key={i}/>
                    <p className="name"> {user.displayName} </p>
                </label>
            ))}
        </div>
    )

}

export default UserList;
