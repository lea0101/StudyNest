import React from "react";

const WordDisplay = ({ word, guessedLetters }) => {
    return (
        <div className="word-display">
            {word && (word.split('').map((letter, index) => (
                <span key={index} className="letter-container">
                    <span className={`letter ${guessedLetters.includes(letter) ? 'correct' : ''}`}>
                        {letter}
                    </span>
                    <span className="underscore">_</span>
                </span>
            )))}
        </div>
    );
};

export default WordDisplay;