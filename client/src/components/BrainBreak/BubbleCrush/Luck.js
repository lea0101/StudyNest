import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import mainLogo from './img/default_icon_3.png'


function Luck() {
    const navigate = useNavigate();
    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;


    const handleGoBack = () => {
        navigate(`/rooms/${roomName}/brainbreak`, { state: {roomCode : roomCode}});
    }

    return (
        <div>
            <div className="hangman">

                <h1>Good Luck Next Time!</h1>

                <img
                                
                    src={mainLogo}
                />
                <button className="dynamic-button s" onClick={handleGoBack}>
                    <p>Go Back</p>
                </button>

            </div>
        </div>
    )
}

export default Luck;