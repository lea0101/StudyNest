import React, {useEffect, createContext, useState, useContext } from 'react';
import { db } from '../../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// create a context
const RoomSettingsContext = createContext();

// custom hook to use RoomSettingsContext
export const useRoomSettings = () => useContext(RoomSettingsContext);

// provider component
export const RoomSettingsProvider = ({ children, roomCode }) => {
    const [selectedColor, setSelectedColor] = useState('default');
    const [selectedLight, setSelectedLight] = useState('light');

    useEffect(() => {
        if (!roomCode) {
            console.log("No room code provided to RoomSettingsProvider")
            return;
        }

        const roomRef = doc(db, 'rooms', roomCode);

        console.log("RoomSettingsContext initialized with roomCode: ", roomCode);

        // listen for real-time updates to the room settings
        const unsubscribe = onSnapshot(roomRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setSelectedColor(data.settings?.color || 'default');
                setSelectedLight(data.settings?.light || 'light');
            } else {
                console.error("doc does not exist")
            }
        });

        // cleanup
        return () => unsubscribe();

    }, [roomCode]);

    return (
        <RoomSettingsContext.Provider value={{ roomCode, selectedColor, setSelectedColor, selectedLight, setSelectedLight }}>
            { children }
        </RoomSettingsContext.Provider>
    );
};
