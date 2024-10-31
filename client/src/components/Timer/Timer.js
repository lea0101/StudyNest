import React from 'react';
import { useState, useEffect } from 'react';

function Timer() {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [hoursInput, setHoursInput] = useState(0);
    const [minutesInput, setMinutesInput] = useState(0);
    const [secondsInput, setSecondsInput] = useState(0);
    const [countdownTime, setCountdownTime] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [paused, setPaused] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (isActive && countdownTime) {
            const interval = setInterval(() => {
                const now = new Date().getTime();
                const remainingTime = countdownTime - now;

                if (remainingTime > 0) {
                    setHours(Math.floor(remainingTime / (1000 * 60 * 60)));
                    setMinutes(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60)));
                    setSeconds(Math.floor((remainingTime % (1000 * 60)) / 1000));
                    setRemainingTime(remainingTime);
                } else {
                    alert("Break time!");
                    clearInterval(interval);
                    setIsActive(false);
                    setPaused(false);
                    setHours(0);
                    setMinutes(0);
                    setSeconds(0);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isActive, paused, countdownTime]);

    const handleStart = () => {
        if (isActive && !paused) {
            // pause timer
            setPaused(true);
            setIsActive(false); // stops interval without clearing remaining time
        } else if (paused) {
            // resume timer
            setCountdownTime(Date.now() + remainingTime); // set new target time
            setPaused(false);
            setIsActive(true);
        } else {
            // start timer for the first time
            const totalSeconds = (hoursInput * 3600) + (minutesInput * 60) + (secondsInput) + 2;
            setCountdownTime(Date.now() + totalSeconds * 1000);
            setIsActive(true);
        }
        
    }

    const handleRestart = () => {
        setIsActive(false);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setHoursInput("");
        setMinutesInput("");
        setSecondsInput("");
        setCountdownTime(null);
    }

    return (
        <div className="timer">
            <div className="timer-container">
                <h3 style={{color: "rgb(0, 0, 0)"}}>Study Timer</h3>

                <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
                    <input type="number" placeholder='Hours' value={hoursInput} onChange={(e) => setHoursInput(Number(e.target.value))}></input>
                    <input type="number" placeholder='Minutes' value={minutesInput} onChange={(e) => setMinutesInput(Number(e.target.value))}></input>
                    <input type="number" placeholder='Seconds' value={secondsInput} onChange={(e) => setSecondsInput(Number(e.target.value))}></input>
                    <button className="dynamic-button" style={{width: "70px"}} onClick={handleStart}>
                        {isActive && !paused ? "Pause" : "Start"}
                    </button>
                    <button className="dynamic-button" style={{width: "70px"}} onClick={handleRestart}>Restart</button>
                </div>

                <h1 style={{color: "rgb(0, 0, 0)"}}>{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</h1>

            </div>
        </div>
    )
}

export default Timer;