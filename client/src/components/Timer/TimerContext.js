import React from 'react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc, count, updateDoc, onSnapshot } from 'firebase/firestore';

const TimerContext = createContext();

export const useTimer = () => useContext(TimerContext);

export const TimerProvider = ({ roomCode, children }) => {
    const [timerComplete, setTimerComplete] = useState(false);

    useEffect(() => {
        const timerRef = doc(db, 'rooms', roomCode);

        const unsubscribe = onSnapshot(timerRef, (doc) => {
            const data = doc.data().timer;
            if (data && data.timerComplete) {
                setTimerComplete(true);
            }
        })

        return () => unsubscribe();
    })

    const resetTimerComplete = async () => {
        const timerRef = doc(db, 'rooms', roomCode);
        await updateDoc(timerRef, { 'timer.timerComplete': false });
        setTimerComplete(false);
    }

    return (
        <TimerContext.Provider value={{ timerComplete, resetTimerComplete }}>
            {children}
        </TimerContext.Provider>
    )
};