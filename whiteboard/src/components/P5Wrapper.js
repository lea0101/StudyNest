import React, { useState, useEffect, useRef } from 'react';
import { Rectangle, Ellipse, Curve, Shader, getShapeType } from './shape';
import p5 from 'p5';

const P5Wrapper = ({ tool, color }) => {
    const sketchRef = useRef(null);
    let [strokes, setStrokes] = useState([]);
    // let [tool, setTool] = useState(activeTool);
    // let [color, setColor] = useState(activeColor);

    // useEffect(() => {
    //     setTool(activeTool);
    //     setColor(activeColor);
    // }, [activeTool, activeColor]);

    function updateStrokes(new_strokes) {
        setStrokes(new_strokes);
        // do other db stuff
    }
    useEffect(() => {
        const sketch = (p) => {
            let currentShape = null;

            p.setup = function () {
                let canvas = p.createCanvas(1200, 700);
                canvas.parent(sketchRef.current);
            };

            p.draw = function () {
                p.background(255);
                for (let shape of strokes) {
                    shape.display(p);
                }
                if (currentShape) {
                    switch (getShapeType(currentShape)) {
                        case 'rectangle':
                            currentShape.width = p.mouseX - currentShape.x;
                            currentShape.height = p.mouseY - currentShape.y;
                            break;
                        case 'ellipse':
                            currentShape.width = p.mouseX - currentShape.x;
                            currentShape.height = p.mouseY - currentShape.y;
                            break;
                        case 'curve':
                            currentShape.addPoint({x: p.mouseX, y: p.mouseY});
                            break;
                        default:
                            console.log("default");
                            break;
                        }
                    currentShape.display(p);
                }
                if (p.mouseIsPressed) {
                    if (tool === 'erase') {
                        for (let i = strokes.length - 1; i >= 0; i--) { // very slow, but works
                            if (strokes[i].isNear(p.mouseX, p.mouseY)) {
                                strokes.splice(i, 1);
                                updateStrokes(strokes);
                                // actionManager.append(new ActionErase(i, strokes[i]));
                            }
                        }
                    }
                }
            };

            p.mousePressed = function () {
                if (p.mouseX <= 0 || p.mouseX >= p.width || p.mouseY <= 0 || p.mouseY >= p.height) {
                    return;
                }
                console.log(p.mouseX, p.mouseY, tool, currentShape);
                let shader = new Shader(color, null, 10, false);
                switch (tool) {
                    case 'rectangle':
                        currentShape = new Rectangle(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    case 'ellipse':
                        currentShape = new Ellipse(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    case 'paint':
                        currentShape = new Curve([{x: p.mouseX, y: p.mouseY}], shader);
                        break;
                    default:
                        console.log("default");
                        break;
                    // case 'select':
                    //     currentShape = new Rectangle(p.mouseX, p.mouseY, 0, 0, shader);
                    //     break;
                }
            }

            p.mouseReleased = function () {
                if (currentShape === null) return;
                console.log(currentShape);
                let shapeType = getShapeType(currentShape);
                if (shapeType === "rectangle" || shapeType === "ellipse") {
                    currentShape.width = p.mouseX - currentShape.x;
                    currentShape.height = p.mouseY - currentShape.y;
                }
                strokes.push(currentShape);
                updateStrokes(strokes);
                currentShape = null;
                console.log(strokes);
            };

        };

        const p5Instance = new p5(sketch, sketchRef.current);

        return () => {
            p5Instance.remove();
        };
    }, [tool, color]);

    return <div className="p5wrapper" ref={sketchRef}></div>;
};

export default P5Wrapper;