import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import NavBar from '../Home/NavBar';
import NotAuthorizedPage from "../../Pages/NotAuthorizedPage";

import './BrainBreak.css'
import { useRoomSettings } from "../Room/RoomSettingsContext";

function BrainBreakPage() {
    const navigate = useNavigate();
    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    const { selectedColor, selectedLight } = useRoomSettings(); // access color and light settings

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

    console.log("selectedLight: ", selectedLight);
    console.log("selectedColor:", selectedColor);

    const handleGoBack = () => {
        navigate(`/rooms/${roomName}`, { state: {roomCode : roomCode}});
    }

    const handleEnterMeditation = () => {
        navigate(`/rooms/${roomName}/brainbreak/meditation`, { state: {roomCode : roomCode}});
    }

    const handleEnterHangman = () => {
        navigate(`/rooms/${roomName}/brainbreak/hangman`, { state: {roomCode : roomCode}});
    }

    return (
        <div className="brain-break"
        style={{
            "backgroundColor": backgroundColor,   
            "color": selectedLight === "light" ? "black" : "white"                    
        }}>
            <NavBar />
            
            <h1>Brain Break Activities</h1>
            <p>Choose an activity!</p>

            <button className="activity-button" onClick={handleEnterMeditation} style={{backgroundColor: buttonColor}}>
                Meditation
            </button>
            <button className="activity-button" onClick={handleEnterHangman} style={{backgroundColor: buttonColor}}>
                Hangman
            </button>

            <div className="room-code" onClick={handleGoBack}>
                <p>Go Back</p>
            </div>

        </div>
    )
}

export default BrainBreakPage;