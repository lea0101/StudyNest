import React, {useEffect, createContext, useState, useContext } from 'react';
import { db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// create a context
const RoomSettingsContext = createContext();

// custom hook to use RoomSettingsContext
export const useRoomSettings = () => useContext(RoomSettingsContext);

// provider component
export const RoomSettingsProvider = ({ children, roomCode }) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const [selectedColor, setSelectedColor] = useState('default');
    const [selectedLight, setSelectedLight] = useState('light');
    const [contextUserRole, setContextUserRole] = useState(null);

    useEffect(() => {
        if (!roomCode || !currentUser) {
            // console.log("No room code provided to RoomSettingsProvider OR user is missing")
            return;
        }

        const roomRef = doc(db, 'rooms', roomCode);

        // console.log("RoomSettingsContext initialized with roomCode: ", roomCode);

        // listen for real-time updates to the room settings
        const unsubscribe = onSnapshot(roomRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();

                // room settings
                setSelectedColor(data.settings?.color || 'default');
                setSelectedLight(data.settings?.light || 'light');

                // find current user's role in userList - can use contextUserRole in other modules to check if they have access
                const userList = data.userList || [];
                const currUserRole = userList.find(user => user.uid === currentUser.uid)?.role || null;
                setContextUserRole(currUserRole);
            } else {
                console.error("room doc does not exist")
            }
        });

        // cleanup
        return () => unsubscribe();

    }, [roomCode, currentUser]);

    return (
        <RoomSettingsContext.Provider value={{ roomCode, selectedColor, setSelectedColor, selectedLight, setSelectedLight, contextUserRole }}>
            { children }
        </RoomSettingsContext.Provider>
    );
};
