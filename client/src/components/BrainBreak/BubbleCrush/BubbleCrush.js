import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import '../BrainBreak.css'
import { useRoomSettings } from "../../Room/RoomSettingsContext";

import blue from './img/default_icon_1.png'
import green from './img/default_icon_2.png'
import orange from './img/default_icon_3.png'
import purple from './img/default_icon_4.png'
import red from './img/default_icon_5.png'
import yellow from './img/default_icon_6.png'
import blank from './splosion.png'



import ScoreBoard from './ScoreBoard'

const width = 8
const bubbleColors = [
    blue,
    orange,
    purple,
    red,
    yellow,
    green
]

const BubbleCrush = () => {
    
    const navigate = useNavigate();
    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    const [level, setLevel] = useState(1); // Track the current level
    const [levelNotification, setLevelNotification] = useState(""); // Notification for leveling up
    const [userInteracted, setUserInteracted] = useState(false); // Tracks user interaction
    const [goBackNotification, setGoBackNotification] = useState(""); // Tracks notification for "Go Back"


    const { selectedColor, selectedLight } = useRoomSettings(); // access color and light settings

    

    const handleGoBack = () => {
        navigate(`/rooms/${roomName}/brainbreak`, { state: {roomCode : roomCode}});
    }

    
    const [colorState, setcolorState] = useState([])
    const [squareBeingDragged, setDraggedSquare] = useState(null)
    const [squareBeingReplaced, setReplacedSquare] = useState(null)
    const [scoreDisplay, updateScore] = useState(0)
    

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + width, i + width * 2, i + width * 3]
            const decidedColor = colorState[i]
            const isBlank = colorState[i] === blank

            if (columnOfFour.every(square => colorState[square] === decidedColor && !isBlank)) {
                updateScore((score) => score + 4)
                columnOfFour.forEach(square => colorState[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3]
            const decidedColor = colorState[i]
            const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64]
            const isBlank = colorState[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => colorState[square] === decidedColor && !isBlank)) {
                updateScore((score) => score + 4)
                rowOfFour.forEach(square => colorState[square] = blank)
                return true
            }
        }
    }

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + width, i + width * 2]
            const decidedColor = colorState[i]
            const isBlank = colorState[i] === blank

            if (columnOfThree.every(square => colorState[square] === decidedColor && !isBlank)) {
                updateScore((score) => score + 3)
                columnOfThree.forEach(square => colorState[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2]
            const decidedColor = colorState[i]
            const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]
            const isBlank = colorState[i] === blank

            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => colorState[square] === decidedColor && !isBlank)) {
                updateScore((score) => score + 3)
                rowOfThree.forEach(square => colorState[square] = blank)
                return true
            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && colorState[i] === blank) {
                let randomNumber = Math.floor(Math.random() * bubbleColors.length)
                colorState[i] = bubbleColors[randomNumber]
            }

            if ((colorState[i + width]) === blank) {
                colorState[i + width] = colorState[i]
                colorState[i] = blank
            }
        }
    }

    const dragStart = (e) => {
        setDraggedSquare(e.target)
    }
    const dragDrop = (e) => {
        setReplacedSquare(e.target)
    }

    const dragEnd = () => {
        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        colorState[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
        colorState[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplacedId)

        const isAColumnOfFour = checkForColumnOfFour()
        const isARowOfFour = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree = checkForRowOfThree()

        if (squareBeingReplacedId &&
            validMove &&
            (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)) {
            setDraggedSquare(null)
            setReplacedSquare(null)
        } else {
            colorState[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
            colorState[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setcolorState([...colorState])
        }
        
    }

    const makeBoard = () => {
        const randomColorArrangement = []
        for (let i = 0; i < width * width; i++) {
            const randomColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
            randomColorArrangement.push(randomColor)
        }
        setcolorState(randomColorArrangement)
        
    }

    const getFirstDigit = (num) => {
        const absNum = Math.abs(num);
        // If single digit, return 0
        if (absNum < 10) {
            return 0;
        }
        // Remove the last digit using integer division
        return Math.floor(absNum / 10);

        const numStr = Math.abs(num).toString(); // Convert to string and handle negative numbers
        return numStr.length === 1 ? 0 : parseInt(numStr[0], 10);
    }

    useEffect(() => {
        makeBoard()
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setcolorState([...colorState])
        }, 100)
        return () => clearInterval(timer)
    }, [checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, colorState])
    
    // Update level based on score
    useEffect(() => {
        const newLevel = getFirstDigit(scoreDisplay);
        if (newLevel !== level) {
            setLevel(newLevel);
            setLevelNotification(`Congrats! You've reached Level ${newLevel}!`);
            setTimeout(() => setLevelNotification(""), 3000); // Clear notification after 3 seconds
        }
    }, [scoreDisplay, level]);


    // Track user interactions
    const handleUserInteraction = () => {
        setUserInteracted(true);
    };

    // Handle Go Back button click
    const handleGoBackClick = () => {
        const score = scoreDisplay;
        
        navigate(`/rooms/${roomName}/brainbreak/bubblecrush/luck`, { state: {roomCode : roomCode}});
        
        //handleGoBack(); // Trigger the existing go back functionality
    };

    
    return (
        <div>
            <div className="bc-hangman"
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
                
                <h1 className="title">BubbleCrush</h1>
                <h2>Your Score: {scoreDisplay}
                </h2>
                
                {/* Level Display */}
                <h2>Level: {level}</h2>

                {/* Level Notification */}
                {levelNotification && (

                    <div className="message level-notification">
                        <p style={{"font-weight": "bold", color: "black"}}> {levelNotification} </p>
                    </div>
         
                )}

                <div className="room-code2" onClick={handleGoBackClick}>
                    <p>Quit Hangman</p>
                </div>
                <div className="room-code" onClick={handleGoBack}>
                    <p>Go Back</p>
                </div>

                <div className="app">
                    
                    <div onClick={handleUserInteraction} className="game">
                        {colorState.map((candyColor, index) => (
                            <img
                                key={index}
                                src={candyColor}
                                alt={candyColor}
                                data-id={index}
                                draggable={true}
                                onDragStart={dragStart}
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => e.preventDefault()}
                                onDragLeave={(e) => e.preventDefault()}
                                onDrop={dragDrop}
                                onDragEnd={dragEnd}
                            />
                        ))}
                    </div>
                    
                </div>

            </div>
        </div>
    )
}

export default BubbleCrush;
