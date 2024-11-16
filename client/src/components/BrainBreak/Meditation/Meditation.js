import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import NavBar from '../../Home/NavBar';
import NotAuthorizedPage from "../../../Pages/NotAuthorizedPage";
import MeditationTimer from "./MeditationTimer";
import ProgressBar from "./ProgressBar";

import '../BrainBreak.css'
import './Meditation.css'
import { useRoomSettings } from "../../Room/RoomSettingsContext";
import { useTimer } from "../../Timer/TimerContext";

import breathingExercisesImage from './images/breathing-exercise.png';
import muscleRelaxationImage from './images/muscle-relaxation.jpg';
import positiveAffirmationsImage from './images/self-love.png';

const steps = [
    {
        id: 0,
        title: "",
        instructions: "Take a break from studying by following this step-by-step meditation guide! When you're ready to begin, click Begin."
    },
    {
        id: 1,
        title: "Breathing Exercises",
        image: breathingExercisesImage,
        instructions: "Sit comfortably, close your eyes, and take slow, deep breaths. Inhale for 4 seconds. Hold for 4 seconds. Exhale for 4 seconds. Repeat this for 2 minutes."
    },
    {
        id: 2,
        title: "Muscle Relaxation",
        image: muscleRelaxationImage,
        instructions: "Start from your toes and work your way up. Tense each muscle group for 5 seconds. Then release. Feel the stress and tension go away. Repeat this for 2 minutes."
    },
    {
        id: 3,
        title: "Positive Affirmations",
        image: positiveAffirmationsImage,
        instructions: "Repeat positive affirmations. I am calm and in control. I deserve peace. I am strong. I am smart. I am capable."
    }

];

function Meditation() {
    const navigate = useNavigate();
    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    const { selectedColor, selectedLight, contextUserRole } = useRoomSettings(); // access color and light settings

    const [currStep, setCurrStep] = useState(() => {
        const savedStep = parseInt(localStorage.getItem("meditationCurrStep"), 10);
        return isNaN(savedStep) || savedStep < 0 || savedStep >= steps.length ? 0 : savedStep;
    });

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

    // save current step to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("meditationCurrStep", currStep);
    }, [currStep]);

    const handleBegin = () => {
        setCurrStep(1);
    }

    const handleBack = () => {
        if (currStep > 0) {
            setCurrStep(currStep - 1);
        }
    }

    const handleNext = () => {
        if (currStep < steps.length - 1) {
            setCurrStep(currStep + 1);
        }
    }

    const handleComplete = () => {
        setCurrStep(0);
        localStorage.setItem("meditationCurrStep", 0);
        navigate(`/rooms/${roomName}/brainbreak`, { state: {roomCode : roomCode}});
    }

    const handleGoBack = () => {
        navigate(`/rooms/${roomName}/brainbreak`, { state: {roomCode : roomCode}});
    }

    return (
        <div
        style={{
            "backgroundColor": backgroundColor,   
            "color": selectedLight === "light" ? "black" : "white"                    
        }}>
            <div className="meditation">

                {/* Start or Current Step */}
                {currStep === 0 ? (
                    <div>
                        <h1>Meditation</h1>
                        <p>{steps[0].instructions}</p>
                        <button
                            className="navigation-button"
                            onClick={handleBegin} 
                            style={{backgroundColor: buttonColor}}>
                            Begin!
                        </button>
                    </div>
                ) : (
                    <div>
                        <h1 style={{"color": selectedLight === "light" ? "black" : "white"}}>{steps[currStep].title}</h1>

                        <div className="step-content">
                            <img src={steps[currStep].image} alt={steps[currStep].title} className="step-image" />

                            <div className="step-instructions">
                                <p>{steps[currStep].instructions}</p>
                                <div className="step-timer"> 
                                    <MeditationTimer key={currStep} stepId={currStep} />
                                </div>
                            </div>

                        </div>

                        {/* Progress Bar */}
                        <div className="progress-bar">
                            <ProgressBar
                                bgcolor={buttonColor}
                                completed={Math.floor((currStep / (steps.length - 1)) * 100)}
                            />
                        </div>
                    </div>
                    
                )}

                {/* Navigation Buttons */}
                <div className="navigation">
                    {currStep > 0 && (
                        <button
                        className="navigation-button"
                        style={{backgroundColor: buttonColor}}
                        onClick={handleBack}
                        disabled={currStep === 0}
                        >
                            Back
                        </button>
                    )}
                    
                    {currStep > 0 && currStep < 3 && (
                        <button
                            className="navigation-button"
                            style={{backgroundColor: buttonColor}}
                            onClick={handleNext}
                            disabled={currStep === 3}
                        >
                            Next
                        </button>
                    )}

                    {currStep === 3 && (
                        <button
                        className="navigation-button"
                        style={{backgroundColor: buttonColor}}
                        onClick={handleComplete}
                    >
                        Complete
                    </button>
                    )}
                </div>


                

                <div className="room-code" onClick={handleGoBack}>
                    <p>Go Back</p>
                </div>

            </div>
        </div>
    )
}

export default Meditation;