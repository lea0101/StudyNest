import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { db } from '../../config/firebase';
import { doc, setDoc, getDoc, count, updateDoc, onSnapshot } from 'firebase/firestore';

import { useRoomSettings } from '../Room/RoomSettingsContext';
import { useTimer } from './TimerContext';

function Timer() {
    const { roomCode, selectedLight, selectedColor } = useRoomSettings();
    const { isTimerDone, notifyTimerDone, resetTimerStatus } = useTimer();

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [hoursInput, setHoursInput] = useState("");
    const [minutesInput, setMinutesInput] = useState("");
    const [secondsInput, setSecondsInput] = useState("");
    const [countdownTime, setCountdownTime] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [paused, setPaused] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    const [error, setError] = useState("");

    // firestore reference for timer document
    const timerRef = doc(db, 'rooms', roomCode);
    const intervalRef = useRef(null); // store interval reference

    // load timer state from firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(timerRef, (doc) => {
            if (doc.exists) {
                try {
                    const timerData = doc.data().timer;
                    
                    if (timerData) {
                        const { countdownTime, remainingTime, isActive, paused } = timerData;

                        if (isActive && countdownTime) {
                            const adjustedCountdownTime = countdownTime - Date.now();
                            setCountdownTime(countdownTime);
                            setIsActive(true);
                            setPaused(false);
                            setRemainingTime(adjustedCountdownTime);
                            updateDisplay(adjustedCountdownTime);
                        } else if (paused) {
                            setRemainingTime(remainingTime);
                            setIsActive(false);
                            setPaused(true);
                        } else {
                            setRemainingTime(remainingTime);
                            setIsActive(false);
                            setPaused(false);
                        }
                    }
                } catch (error) {
                    console.error("Error loading timer data: ", error);
                }
            }
        });

        return () => unsubscribe;

        // const loadTimerData = async () => {
        //     try {
        //         const timerDoc = await getDoc(timerRef);
        //         if (timerDoc.exists()) {
        //             const timerData = timerDoc.data().timer;
        //             if (timerData) {
        //                 const { countdownTime, remainingTime, isActive, paused } = timerData;

        //                 if (isActive && countdownTime) {
        //                     const adjustedCountdownTime = countdownTime - Date.now();
        //                     setCountdownTime(countdownTime);
        //                     setIsActive(true);
        //                     setPaused(paused);
        //                     setRemainingTime(adjustedCountdownTime);
        //                     updateDisplay(adjustedCountdownTime);
        //                 } else {
        //                     setRemainingTime(remainingTime);
        //                 }
        //             }
        //         }
        //     } catch (error) {
        //         console.error("Error loading timer data: ", error);
        //     }
        // };
        // loadTimerData();

    }, [roomCode]);

    // handle countdown timer interval
    useEffect(() => {
        if (isActive && countdownTime) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            const tick = () => {
                const now = Date.now();
                const timeLeft = countdownTime - now;

                if (timeLeft > 0) {
                    updateDisplay(timeLeft);
                    setRemainingTime(timeLeft);
                } else {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    resetTimer();
                    handleComplete();

                    console.log("STUDY BREAK TIME!!!");
                }
            };

            tick();
            intervalRef.current = setInterval(tick, 1000);

            return () => clearInterval(intervalRef.current);
        }
    }, [isActive, countdownTime]);

    const handleStart = async () => {
        if (secondsInput < 0 || minutesInput < 0 || hoursInput < 0) {
            alert("Please input valid times! Times cannot be negative.");
            return;
        }

        if (isActive && !paused) {
            // pause timer
            setPaused(true);
            setIsActive(false); // stops interval without clearing remaining time

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            await updateTimerInFirestore({ paused: true, isActive: false, remainingTime });
        } else if (paused) {
            // resume timer
            const newCountdownTime = Date.now() + remainingTime;

            setCountdownTime(newCountdownTime); // set new target time
            setPaused(false);
            setIsActive(true);

            await updateTimerInFirestore({ countdownTime: newCountdownTime, paused: false, isActive: true });
        } else {
            // start timer for the first time
            const totalMilliseconds = (hoursInput * 3600 + minutesInput * 60 + secondsInput) * 1000;
            const endTimestamp = Date.now() + totalMilliseconds;

            setCountdownTime(endTimestamp);
            setRemainingTime(totalMilliseconds);
            setPaused(false);
            setIsActive(true);

            // initialize display immediately
            updateDisplay(totalMilliseconds);

            await updateTimerInFirestore({ countdownTime: endTimestamp, remainingTime: totalMilliseconds, isActive: true, paused: false });
        }
        
    }

    const resetTimer = () => {
        setIsActive(false);
        setPaused(false);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setHoursInput("");
        setMinutesInput("");
        setSecondsInput("");
        setCountdownTime(null);
        setRemainingTime(0);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const handleRestart = () => {
        resetTimer();

        updateDoc(timerRef, {
            timer: {
                countdownTime: null,
                remainingTime: 0,
                isActive: false,
                paused: false,
                initialDuration: 0
            }
        });
    };

    const handleComplete = async () => {
        resetTimer();

        alert("STUDY BREAK TIME!!");
    
        await updateDoc(timerRef, {
            'timer.timerComplete': true, // Set flag in Firestore
            'timer.isActive': false,
            'timer.remainingTime': 0
        });

        // wait briefly before resetting completion status
        setTimeout(() => {
            resetTimerStatus();
        }, 1000); // 1 second delay
    };
    

    const updateDisplay = (timeLeft) => {
        const newTimeLeft = timeLeft + 1000;
        setHours(Math.floor(newTimeLeft / (1000 * 60 * 60)));
        setMinutes(Math.floor((newTimeLeft % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((newTimeLeft % (1000 * 60)) / 1000));
    }

    const updateTimerInFirestore = async (timerData) => {
        try {
            await updateDoc(timerRef, { timer: timerData });
        } catch (error) {
            console.error("Error updating timer in Firestore: ", error);
        }
    }

    return (
        <div className="timer"
        style={{
            "background-color":
                selectedLight === "light"
                ? "white"
                : selectedLight === "dark"
                ? "rgb(100, 100, 100)"
                : "white",                       
        }}>
            <div className="timer-container"
            >
                <h3>Study Timer</h3>

                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <input type="number" placeholder='Hours' value={hoursInput} onChange={(e) => setHoursInput(Number(e.target.value))}></input>
                    <input type="number" placeholder='Minutes' value={minutesInput} onChange={(e) => setMinutesInput(Number(e.target.value))}></input>
                    <input type="number" placeholder='Seconds' value={secondsInput} onChange={(e) => setSecondsInput(Number(e.target.value))}></input>
                    <button className="dynamic-button" style={{width: "70px"}} onClick={handleStart}>
                        {isActive && !paused ? "Pause" : paused ? "Resume" : "Start"}
                    </button>
                    <button className="dynamic-button" style={{width: "70px"}} onClick={handleRestart}>Restart</button>
                </div>

                <h1>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h1>

            </div>
        </div>
    )
}

export default Timer;