import React, { useState } from 'react';
import P5Wrapper from './P5Wrapper';
import './WhiteBoard.css'

const WhiteBoard = () => {
    let [tool, setTool] = useState('ellipse');
    let [color, setColor] = useState('black');
    return (
        <div className="module">
            <div className="toolbar">
                {/* <div>
                    <button id="undo" onClick={popAction()}>Undo</button>
                    <button id="redo" onClick={pushAction()}>Redo</button>
                </div> */}
                <div id="tool-select" className="single-select no-null-select">
                    <button id="paint" className="default-select" onClick={() => setTool('paint')}>Paint</button>
                    <button id="rectangle" onClick={() => setTool('rectangle')}>Rectangle</button>
                    <button id="ellipse" onClick={() => setTool('ellipse')}>Ellipse</button>
                    <button id="erase" onClick={() => setTool('erase')}>Erase</button>
                    {/* <button id="select" className="default-select" onClick={singleSelect(this)}>Select</button> */}
                </div>
                <div id="color-select" className="single-select no-null-select">
                    <div>
                        {/* <!-- enable fill --> */}
                        <input type="checkbox" id="fill-enable" />
                            <label htmlFor="fill">Fill</label>
                    </div>
                    <button id="black" className="default-select" onClick={() => setColor('black')}></button>
                    <button id="red" onClick={() => setColor('red')}></button>
                    <button id="green" onClick={() => setColor('green')}></button>
                    <button id="blue" onClick={() => setColor('blue')}></button>
                </div>
            </div>
            <P5Wrapper tool={tool} color={color} />
        </div>
    );
}

export default WhiteBoard;