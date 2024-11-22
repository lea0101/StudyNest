import React, { useState, useEffect, useRef } from 'react';
import { Rectangle, StrokeImage, Ellipse, Curve, Shader, getShapeType, generateShapeFromJSON } from './shape';
import p5 from 'p5';
import {
    query,
    collection,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";
import { db } from "../../config/firebase";

const P5Wrapper = ({ roomCode, tool, color, fill, clearEvent, setClearEvent, newImageURL }) => {
    const sketchRef = useRef(null);
    let [strokes, setStrokes] = useState([]);
    let [selection, setSelection] = useState([]);
    let [selectedShape, setSelectedShape] = useState(null);
    let [contextMenu, setContextMenu] = useState(null);
    let [contextWidthParam, setContextWidthParam] = useState(0);
    let [contextHeightParam, setContextHeightParam] = useState(0);

    useEffect(() => {
        if (newImageURL) {
            let shader = new Shader(color, fill ? color : null, 10, false);
            let image = new StrokeImage(0, 0, 0, 0, newImageURL, shader);
            addStroke(image);
        }
    }, [newImageURL]);

    useEffect(() => {
        document.addEventListener('contextmenu', event => event.preventDefault());
        const q = query(
            collection(db, `strokes-${roomCode}`)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedStrokes = [];
            QuerySnapshot.forEach((doc) => {
                let stroke = generateShapeFromJSON(doc.data());
                stroke.setID(doc.ref);
                fetchedStrokes.push(stroke);
            });
            const sortedStrokes = fetchedStrokes.sort((a, b) => a.createdAt - b.createdAt);
            setStrokes(sortedStrokes);
        });
        return () => unsubscribe;
    }, []);

    async function addStroke(stroke) {
        const docRef = await addDoc(collection(db, `strokes-${roomCode}`), {...stroke.toJSON(), createdAt: serverTimestamp()});
        stroke.setID(docRef);
        strokes.push(stroke);
        setStrokes([...strokes]);
    }

    async function deleteStroke(idx) {
        await deleteDoc(strokes[idx].id);
        strokes.splice(idx, 1);
        // strokes = strokes.filter(stroke => stroke.id !== id);
        setStrokes([...strokes]);
    }

    useEffect(() => {
        const deleteStrokes = async () => {
            const deletePromises = strokes.map((stroke) => deleteDoc(stroke.id));
            await Promise.all(deletePromises);
            setStrokes([]);
            setClearEvent(false);
        };
        if (clearEvent) {
            deleteStrokes();
        }
    }, [clearEvent]);

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
                    let newJSON = shape.display(p);
                    if (newJSON) {
                        updateDoc(shape.id, newJSON);
                    }
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
                            currentShape.addPoint({ x: p.mouseX, y: p.mouseY });
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
                                deleteStroke(i);
                                // deleteStroke(strokes[i]);
                                // strokes.splice(i, 1);
                                // updateStrokes(strokes);
                                // actionManager.append(new ActionErase(i, strokes[i]));
                            }
                        }
                    }
                }
                // draw box around selected shapes
                if (selection.length > 0) {
                    let minX = selection[0].getMinX();
                    let minY = selection[0].getMinY();
                    let maxX = selection[0].getMaxX();
                    let maxY = selection[0].getMaxY();
                    for (let shape of selection) {
                        minX = Math.min(minX, shape.getMinX());
                        minY = Math.min(minY, shape.getMinY());
                        maxX = Math.max(maxX, shape.getMaxX());
                        maxY = Math.max(maxY, shape.getMaxY());
                    }
                    p.noFill();
                    p.stroke(0);
                    p.strokeWeight(1);
                    p.rect(minX, minY, maxX - minX, maxY - minY);
                    p.text(`strokes-${roomCode}`, p.width/2, p.height/2);
                }
            };

            p.mousePressed = function (event) {
                if (p.mouseX <= 0 || p.mouseX >= p.width || p.mouseY <= 0 || p.mouseY >= p.height) {
                    return;
                }
                let shader = new Shader(color, fill ? color : null, 10, false);
                switch (tool) {
                    case 'grab':
                        if (event.button !== 2) {
                            setContextMenu(null);
                            break;
                        }
                        for (let shape of strokes) {
                            if (shape.isNear(p.mouseX, p.mouseY)) {
                                setContextMenu({
                                    shape: shape,
                                    x: p.mouseX,
                                    y: p.mouseY
                                });
                                return;
                            }
                        }
                        setContextMenu(null);
                        break;
                    case 'rectangle':
                        currentShape = new Rectangle(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    case 'ellipse':
                        currentShape = new Ellipse(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    case 'paint':
                        currentShape = new Curve([{ x: p.mouseX, y: p.mouseY }], shader);
                        break;
                    case 'select':
                        currentShape = new Rectangle(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    default:
                        console.log("default");
                        break;
                }
            };

            p.mouseDragged = function (event) {
                if (p.mouseX <= 0 || p.mouseX >= p.width || p.mouseY <= 0 || p.mouseY >= p.height) {
                    return;
                }
                // tool is grab and left click
                if (tool !== 'grab') {
                    return;
                }
                if (!selectedShape) {
                    for (let shape of strokes) {
                        if (shape.isNear(p.mouseX, p.mouseY)) {
                            selectedShape = shape;
                            setSelectedShape(shape);
                            break;
                        }
                    }
                }
                if (!selectedShape) return;
                p.cursor('grab');
                if (getShapeType(selectedShape) === 'curve') {
                    for (let point of selectedShape.points) {
                        point.x += event.movementX;
                        point.y += event.movementY;
                    }
                } else {
                    selectedShape.x += event.movementX;
                    selectedShape.y += event.movementY;
                }
            }

            p.mouseReleased = function (event) {
                if (tool === 'grab') {
                    if (event.button === 2) {
                        console.log(contextMenu);
                    }
                    if (!selectedShape) return;
                    updateDoc(selectedShape.id, selectedShape.toJSON());
                    setSelectedShape(null);
                    return;
                }
                if (currentShape === null) return;
                let shapeType = getShapeType(currentShape);
                if (shapeType === "rectangle" || shapeType === "ellipse") {
                    currentShape.width = p.mouseX - currentShape.x;
                    currentShape.height = p.mouseY - currentShape.y;
                }
                // strokes.push(currentShape);
                // updateStrokes(strokes);
                if (tool != 'select') {
                    addStroke(currentShape);
                } else {
                    let newSelection = [];
                    for (let i = 0; i < strokes.length; i++) {
                        if (strokes[i].isBoundedBy(currentShape)) {
                            // add to selection
                            newSelection.push(strokes[i]);
                        }
                    }
                    setSelection([...newSelection]);
                }
                currentShape = null;
            };

        };

        const p5Instance = new p5(sketch, sketchRef.current);

        return () => {
            p5Instance.remove();
        };

    }, [tool, color, fill, strokes, selection]);

    useEffect(() => {
        if (contextMenu) {
            setContextWidthParam(contextMenu.shape.width);
            setContextHeightParam(contextMenu.shape.height);
        }
    }, [contextMenu]);

    return <>
        <div className="p5wrapper" ref={sketchRef}></div>
        {contextMenu && <div className="context-menu" style={{left: contextMenu.x, top: contextMenu.y}}>
            {/* Resize options if type is Rectangle or Ellipse */}
            {/* Input boxes for width and height that update the shape when changed */}
            {contextMenu.shape.width && contextMenu.shape.height && 
            <div className="resize-menu">
                <div className="resize-param">
                    <label htmlFor="width">Width</label><input name="width" type="number" value={contextWidthParam} onChange={(event) => {
                        if (event.target.value <= 0) {
                            return;
                        }
                        console.log(event.target.value);
                        contextMenu.shape.width = event.target.value;
                        setContextWidthParam(contextMenu.shape.width);
                        updateDoc(contextMenu.shape.id, contextMenu.shape.toJSON());
                    }} />
                </div>
                <div className="resize-param">
                    <label htmlFor="height">Height</label><input name="height" type="number" value={contextHeightParam} onChange={(event) => {
                        if (event.target.value <= 0) {
                            return;
                        }
                        console.log(event.target.value);
                        contextMenu.shape.height = event.target.value;
                        setContextHeightParam(contextMenu.shape.height);
                        updateDoc(contextMenu.shape.id, contextMenu.shape.toJSON());
                    }} />
                </div>
            </div>
            }
            <button className="b-button" onClick={() => deleteStroke(strokes.indexOf(contextMenu.shape))}>Delete</button>
        </div>}
    </>;
};

export default P5Wrapper;