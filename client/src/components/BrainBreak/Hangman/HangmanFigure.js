import React from "react";

const HangmanFigure = ({ wrongGuesses }) => {
    return (
        <div className="hangman-figure">
            <div className="stand">
                <div className="base"></div>
                <div className="pole"></div>
                <div className="beam"></div>
                <div className="rope"></div>
            </div>

            {wrongGuesses > 0 && <div className="head"></div>}
            {wrongGuesses > 1 && <div className="body"></div>}
            {wrongGuesses > 2 && <div className="left-arm"></div>}
            {wrongGuesses > 3 && <div className="right-arm"></div>}
            {wrongGuesses > 4 && <div className="left-leg"></div>}
            {wrongGuesses > 5 && <div className="right-leg"></div>}
        </div>
    );
};

export default HangmanFigure;