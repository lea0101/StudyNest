import React, { useEffect, useState } from "react"
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import HangmanFigure from "./HangmanFigure";
import WordDisplay from "./WordDisplay";
import Keybord from "./Keyboard";
import wordList from "./wordList.json"
import './Hangman.css'
import { useTimer } from "../../Timer/TimerContext";

function Hangman() {
    const navigate = useNavigate();
    const { roomName } = useParams(); // get room name from url params
    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    const { isTimerDone, isActive, resetTimerStatus } = useTimer(); // access timer

    const [word, setWord] = useState('STUDYNEEST');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [incorrectLetters, setIncorrectLetters] = useState([]);
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [isWin, setIsWin] = useState(false);

    // timer popup
    useEffect(() => {
        if (isTimerDone && !isActive) {
            alert("STUDY BREAK TIME !!!");
            resetTimerStatus();
        }
    }, [isTimerDone, resetTimerStatus]);

    useEffect(() => {
        // pick a random word from wordList.json
        const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
        setWord(randomWord.toUpperCase());
    }, []);

    const handleLetterClick = (letter) => {
        if (guessedLetters.includes(letter) || isWin || wrongGuesses >= 6) return;

        const newGuessedLetters = [...guessedLetters, letter];
        setGuessedLetters(newGuessedLetters);

        if (word.includes(letter)) {
            // check if all letters are guessed
            const allLettersGuessed = word.split('').every(l => newGuessedLetters.includes(l));
            if (allLettersGuessed) {
                setIsWin(true);
            }
        } else {
            setWrongGuesses(wrongGuesses + 1);
            setIncorrectLetters([...incorrectLetters, letter]);
        }
    }

    const isGameOver = wrongGuesses >= 6; // game is over if 6 wrong guesses are used

    const handleGoBack = () => {
        navigate(`/rooms/${roomName}/brainbreak`, { state: {roomCode : roomCode}});
    }

    return (
        <div>
            <div className="hangman">
                
                {isGameOver && (
                    <div className="message">
                        <p style={{"font-weight": "bold"}}>Game Over! The word was "{word}". Refresh to play again.</p>
                    </div>
                )}

                {isWin && (
                    <div className="message">
                    <p style={{"font-weight": "bold"}}>You Win! Refresh to play again.</p>
                </div>
                )}

                <HangmanFigure wrongGuesses={wrongGuesses}/>
                
                <WordDisplay word={word} guessedLetters={guessedLetters}/>

                <Keybord onLetterClick={handleLetterClick} guessedLetters={guessedLetters} incorrectLetters={incorrectLetters}/>

                <div className="room-code" onClick={handleGoBack}>
                    <p>Go Back</p>
                </div>

            </div>
        </div>
    )
}

export default Hangman;