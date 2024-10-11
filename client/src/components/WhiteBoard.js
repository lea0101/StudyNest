import React, { useState } from 'react';
import P5Wrapper from './P5Wrapper';
import './WhiteBoard.css'

const WhiteBoard = () => {
    let [tool, setTool] = useState('ellipse');
    let [color, setColor] = useState('black');
    let [fill, setFill] = useState(false);
    let [clearEvent, setClearEvent] = useState(false);

    function getUpdateToolHandler(event) {
        setTool(event.target.id);
        let buttons = event.target.parentElement.children;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].id !== event.target.id) {
                buttons[i].classList.remove('selected');
            }
        }
        event.target.classList.add('selected');
    }

    function getUpdateColorHandler(event) {
        setColor(event.target.id);
        let buttons = event.target.parentElement.children;
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].id !== event.target.id) {
                buttons[i].classList.remove('selected');
            }
        }
        event.target.classList.add('selected');
    }

    return (
        <div className="module">
            <div className="toolbar">
                {/* <div>
                    <button id="undo" onClick={popAction()}>Undo</button>
                    <button id="redo" onClick={pushAction()}>Redo</button>
                </div> */}
                <div id="tool-select" className="single-select no-null-select">
                    <button id="paint" onClick={getUpdateToolHandler} className="default-select">Paint</button>
                    <button id="rectangle" onClick={getUpdateToolHandler}>Rectangle</button>
                    <button id="ellipse" onClick={getUpdateToolHandler}>Ellipse</button>
                    <button id="erase" onClick={getUpdateToolHandler}>Erase</button>
                    <button id="erase" onClick={() => setClearEvent(true)}>Clear</button>
                    {/* <button id="select" className="default-select" onClick={singleSelect(this)}>Select</button> */}
                </div>
                <div id="color-select" className="single-select no-null-select">
                    <div>
                        {/* <!-- enable fill --> */}
                        <input type="checkbox" id="fill-enable" onChange={(event) => setFill(event.target.checked)} />
                            <label htmlFor="fill">Fill</label>
                    </div>
                    <button id="black" onClick={getUpdateColorHandler} className="default-select"></button>
                    <button id="red" onClick={getUpdateColorHandler}></button>
                    <button id="green" onClick={getUpdateColorHandler}></button>
                    <button id="blue" onClick={getUpdateColorHandler}></button>
                </div>
            </div>
            <P5Wrapper tool={tool} color={color} fill={fill} clearEvent={clearEvent} setClearEvent={setClearEvent}/>
        </div>
    );
}

export default WhiteBoard;