import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import NavBar from '../../Home/NavBar';
import NotAuthorizedPage from "../../../Pages/NotAuthorizedPage";

import '../BrainBreak.css'
import { useRoomSettings } from "../../Room/RoomSettingsContext";

function Meditation() {
    const navigate = useNavigate();
    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    const { selectedColor, selectedLight } = useRoomSettings(); // access color and light settings

    const handleGoBack = () => {
        navigate(`/rooms/${roomName}/brainbreak`, { state: {roomCode : roomCode}});
    }

    return (
        <div>
            <div className="hangman"
            style={{
                "background-color":
                    selectedLight === "light"
                    ? "white"
                    : selectedLight === "dark"
                    ? "rgb(69, 67, 63)"
                    : "white",
                "color":
                    selectedLight === "light"
                    ? "black"
                    : selectedLight === "dark"
                    ? "white"
                    : "white"                       
            }}>
                
                <h1>Meditation</h1>

                <div className="room-code" onClick={handleGoBack}>
                    <p>Go Back</p>
                </div>

            </div>
        </div>
    )
}

export default Meditation;