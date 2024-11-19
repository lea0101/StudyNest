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

const instr1 = 
`
Choose a quiet, comfortable space where you won’t be disturbed. Sit in a chair with your feet flat on the floor, or cross-legged on a cushion. Sit upright but not rigid.<br /><br />
1. Close your eyes or lower your gaze to avoid distractions.<br />
2. Place one hand on your chest and the other on your belly.<br />
3. Inhale deeply through your nose for a count of 4, feeling your belly rise under your hand.<br />
4. Hold your breath for a count of 2.<br />
5. Exhale slowly and completely through your mouth for a count of 6, feeling your belly fall.<br />
6. Repeat for 5 minutes, gradually increasing the duration as you feel comfortable.<br />
7. Return to natural breathing. Gently open your eyes.<br />
`;

const instr2 = 
`
1. Start at Your Feet:<br />
Tighten the muscles in your feet by curling your toes and holding for 5-10 seconds. Slowly release the tension, noticing the sensation as they relax.<br /><br />
2. Move Upward. Progress through each muscle group in your body:<br />
- Legs: Tighten your calves, then your thighs.<br />
- Abdomen and Lower Back: Pull your stomach in slightly.<br />
- Arms: Tighten your hands into fists, then tense your forearms and biceps.<br />
- Shoulders and Neck: Shrug your shoulders toward your ears and hold.<br />
- Face: Scrunch your face into a tight expression, then release.<br /><br />
3. Release and Relax.<br />
After tensing and relaxing each muscle group, pause for a few seconds to notice the difference between tension and relaxation.<br /><br />
4. Finish with Full-Body Relaxation.<br />
Gradually bring your awareness back to your surroundings. Open your eyes slowly, feeling calm and refreshed.<br />
`;

const instr3 =
`
Say your affirmations out loud or silently. Repeat each one 5-10 times.<br />
Speak with confidence and visualize yourself embodying the affirmation.<br /><br />
Examples:<br />
1. I am capable of understanding and mastering any subject I study.<br />
2. I believe in my ability to learn and grow every day.<br />
3. I am confident in my skills and knowledge.<br />
4. I handle challenges with resilience and a positive attitude.<br />
5. I am in control of my thoughts and emotions.<br />
6. I balance work and rest to maintain my well-being.<br />
7. I trust that I am doing my best, and that is enough.<br />
`;


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
        instructions: instr1
    },
    {
        id: 2,
        title: "Muscle Relaxation",
        image: muscleRelaxationImage,
        instructions: instr2
    },
    {
        id: 3,
        title: "Positive Affirmations",
        image: positiveAffirmationsImage,
        instructions: instr3
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

                            <div className="step-guide">
                                <div className="step-instructions">
                                    <p dangerouslySetInnerHTML={{ __html: steps[currStep].instructions }} />
                                </div>
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