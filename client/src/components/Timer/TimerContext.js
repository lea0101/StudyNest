import React from 'react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc, count, updateDoc, onSnapshot } from 'firebase/firestore';

import { useRoomSettings } from '../Room/RoomSettingsContext';

// create a context
const TimerContext = createContext();

// custom hook to use TimerContext
export const useTimer = () => useContext(TimerContext);

// provider component
export const TimerProvider = ({ children }) => {
    const {roomCode} = useRoomSettings();

    const [isTimerDone, setIsTimerDone] = useState(false);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!roomCode) return;

        const timerRef = doc(db, "rooms", roomCode);

        // set up real-time listener for Firestore document
        const unsubscribe = onSnapshot(timerRef, (doc) => {
            if (doc.exists()) {
                const timerData = doc.data().timer;
                if (timerData?.timerComplete) {
                    console.log("Timer complete in Firestore.");
                    setIsTimerDone(true);
                } else {
                    setIsTimerDone(false);
                }

                if (timerData?.isActive) {
                    setIsActive(true);
                } else {
                    setIsActive(false);
                }
            }
        })

        return () => unsubscribe();
    })

    const resetTimerStatus = async () => {
        try {
            const timerRef = doc(db, "rooms", roomCode);
            await updateDoc(timerRef, {
                'timer.timerComplete': false
            });
            setIsTimerDone(false);
        } catch (error) {
            console.error("Error resetting timer status in Firestore: ", error);
        }
    }

    return (
        <TimerContext.Provider value={{ isTimerDone, isActive, resetTimerStatus }}>
            {children}
        </TimerContext.Provider>
    )
};