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

    const handleGoBack = () => {
        navigate(`/rooms/${roomName}`, { state: {roomCode : roomCode}});
    }

    const handleEnterHangman = () => {
        navigate(`/rooms/${roomName}/brainbreak/hangman`, { state: {roomCode : roomCode}});
    }

    return (
        <div>
            <NavBar />

            <div className="brain-break"
            style={{
                "background-color":
                    selectedLight === "light"
                    ? "white"
                    : selectedLight === "dark"
                    ? "rgb(69, 67, 63)"
                    : "white",                       
            }}>
                
                <h1>Brain Break Activities</h1>
                <p>Choose an activity!</p>

                <div className="activity-button" onClick={handleEnterHangman}>
                    <p>Hangman</p>
                </div>

                <div className="room-code" onClick={handleGoBack}>
                    <p>Go Back</p>
                </div>

            </div>
        </div>
    )
}

export default BrainBreakPage;