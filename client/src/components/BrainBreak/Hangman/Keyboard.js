import React from 'react';

const Keybord = ({ onLetterClick, guessedLetters, incorrectLetters }) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    console.log(guessedLetters);

    return (
        <div className='keyboard'>
            {alphabet.split('').map((letter) => {
                const isGuessed = guessedLetters.includes(letter);
                const isIncorrect = incorrectLetters.includes(letter);

                return (
                    <button
                        key={letter}
                        onClick={() => onLetterClick(letter)}
                        disabled={guessedLetters.includes(letter)}
                        className={`letter-button ${isGuessed ? 'disabled' : ''} ${isIncorrect ? 'incorrect' : ''} ${isGuessed && !isIncorrect ? 'correct' : ''}`}
                    >
                        {letter}
                    </button>
                );                
            })}
        </div>
    )
};

export default Keybord;