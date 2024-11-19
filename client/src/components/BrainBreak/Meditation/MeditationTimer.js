import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { db } from '../../../config/firebase';
import { doc, setDoc, getDoc, count, updateDoc, onSnapshot } from 'firebase/firestore';

import { useRoomSettings } from '../../Room/RoomSettingsContext';
import { useTimer } from '../../Timer/TimerContext';
import './Meditation.css'

function MeditationTimer( {stepId} ) {
    const { roomCode, selectedLight, selectedColor } = useRoomSettings();

    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [minutesInput, setMinutesInput] = useState("");
    const [secondsInput, setSecondsInput] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [paused, setPaused] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    const intervalRef = useRef(null); // store interval reference
    const completedRef = useRef(false);

    const backgroundColor = selectedLight === "light" ? "rgb(255, 253, 248)" : "rgb(69, 67, 63)";
    const colorMapping = {
        default: "#6fb2c5",
        red: "rgb(217, 91, 91)",
        orange: "rgb(204, 131, 53)",
        yellow: "rgb(245, 227, 125)",
        green: "rgb(118, 153, 93)",
        blue: "rgb(59, 124, 150)",
        purple: "rgb(165, 132, 224)",
        pink: "rgb(242, 170, 213)"  
    };
    const buttonColor = colorMapping[selectedColor || colorMapping.default];

    // reset timer statet when step changes
    useEffect(() => {
        resetTimer();
    }, [stepId]);
    
    // load timer state from localStorage
    useEffect(() => {
        const savedTime = parseInt(localStorage.getItem('meditationTimerRemainingTime'), 10);
        const savedState = JSON.parse(localStorage.getItem("meditationTmerIsActive"));
        const savedPaused = JSON.parse(localStorage.getItem("meditationTimerPaused"));

        if (!isNaN(savedTime)) {
            setRemainingTime(savedTime);
            updateDisplay(savedTime);
        }

        if (savedState) {
            setIsActive(true);
        } 

        if (savedPaused) {
            setPaused(true);
        }
    }, []);

    // save timer state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("meditationTimerRemainingTime", remainingTime);
        localStorage.setItem("meditationTimerIsActive", isActive);
        localStorage.setItem("meditationTimerPaused", paused);
    }, [remainingTime, isActive, paused]);

    // handle countdown timer interval
    useEffect(() => {
        if (isActive && !paused) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            completedRef.current = false;

            // start and resume the timer
            intervalRef.current = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev <= 1000) {
                        clearInterval(intervalRef.current);
                        handleComplete();
                        return 0;
                    } else {
                        const updatedTime = prev - 1000;
                        updateDisplay(updatedTime);
                        return updatedTime;
                    }
                    
                });
            }, 1000);

            return () => clearInterval(intervalRef.current);

            // const tick = () => {
            //     setRemainingTime((prev) => {
            //         if (prev <= 1000) {
            //             clearInterval(intervalRef.current);
            //             // intervalRef.current = null;
            //             handleComplete();
            //             return 0;
            //         } else {
            //             const updatedTime = prev - 1000;
            //             updateDisplay(updatedTime);
            //             return updatedTime;
            //         }
            //     })
            // };

            // intervalRef.current = setInterval(tick, 1000);

            // return () => clearInterval(intervalRef.current);
        } else if (paused && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, [isActive, paused]);

    const handleStart = async () => {
        if (!isActive) {
            const totalMilliseconds = (minutesInput * 60 + secondsInput) * 1000;
        
            if (totalMilliseconds > 0) {
                setRemainingTime(totalMilliseconds);
                setIsActive(true);
                setPaused(false);
                updateDisplay(totalMilliseconds);
            } else {
                alert("Time cannot be negative! Please enter a valid time.");
            }
        }
    }

    const handlePause = () => {
        if (isActive) {
            setPaused((prev) => !prev);
        }
    }

    const resetTimer = () => {
        setIsActive(false);
        setPaused(false);
        setRemainingTime(0);
        setMinutes(0);
        setSeconds(0);
        setMinutesInput("");
        setSecondsInput("");
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        localStorage.removeItem("meditationTimerRemainingTime");
        localStorage.removeItem("meditationTimerIsActive");
        localStorage.removeItem("meditationTimerPaused");
    };

    const handleRestart = () => {
        resetTimer();
    };

    const handleComplete = async () => {
        if (completedRef.current) {
            return;
        }

        completedRef.current = true;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        alert('Meditation Step Completed!');
        resetTimer();
    };
    

    const updateDisplay = (timeLeft) => {
        const mins = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((timeLeft % (1000 * 60)) / (1000));
        setMinutes(mins);
        setSeconds(secs);
    }

    return (
        <div className="timer"
        style={{
            "backgroundColor":
                selectedLight === "light"
                ? "white"
                : selectedLight === "dark"
                ? "rgb(100, 100, 100)"
                : "white",                       
        }}>
            <div className="timer-container">
                <h3>Meditation Timer</h3>

                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <input
                        type="number"
                        placeholder='Minutes'
                        value={minutesInput}
                        onChange={(e) => setMinutesInput(Number(e.target.value))}
                        disabled={isActive}
                    />

                    <input
                        type="number"
                        placeholder='Seconds'
                        value={secondsInput}
                        onChange={(e) => setSecondsInput(Number(e.target.value))} 
                        disabled={isActive}
                    />

                    <button
                        className="navigation-button"
                        style={{backgroundColor: buttonColor, width: "70px", borderRadius: "10px", padding: "10px"}}
                        onClick={isActive && !paused ? handlePause : handleStart}>
                        {isActive && !paused ? "Pause" : paused ? "Resume" : "Start"}
                    </button>

                    <button
                        className="navigation-button"
                        style={{backgroundColor: buttonColor, width: "70px", borderRadius: "10px", padding: "10px"}}
                        onClick={handleRestart}
                    >
                        Restart
                    </button>

                </div>

                <h1>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h1>

            </div>
        </div>
    )
}

export default MeditationTimer;