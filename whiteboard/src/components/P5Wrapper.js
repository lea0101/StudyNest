import React, { useState, useEffect, useRef } from 'react';
import { Rectangle, Ellipse, Curve, Shader, getShapeType, generateShapeFromJSON } from './shape';
import p5 from 'p5';
import {
    query,
    collection,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    serverTimestamp
} from "firebase/firestore";
import { db } from "../config/firebase";

const P5Wrapper = ({ tool, color, fill }) => {
    const sketchRef = useRef(null);
    let [strokes, setStrokes] = useState([]);
    let [strokeIDs, setStrokeIDs] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, "strokes")
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedStrokes = [];
            QuerySnapshot.forEach((doc) => {
                fetchedStrokes.push(generateShapeFromJSON(doc.data()));
            });
            const sortedStrokes = fetchedStrokes.sort((a, b) => a.createdAt - b.createdAt);
            setStrokes(sortedStrokes);
        });
        return () => unsubscribe;
    }, []);

    async function addStroke(stroke) {
        const docRef = await addDoc(collection(db, "strokes"), {...stroke.toJSON(), createdAt: serverTimestamp()});
        strokes.push(stroke);
        strokeIDs.push(docRef.id);
        setStrokes(strokes);
        setStrokeIDs(strokeIDs);
    }

    async function deleteStroke(id) {
        const docRef = doc(db, "strokes", id);
        await deleteDoc(docRef);

        const strokeIndex = strokeIDs.indexOf(id);
        if (strokeIndex > -1) {
            strokes.splice(strokeIndex, 1);
            strokeIDs.splice(strokeIndex, 1);
            setStrokes([...strokes]);
            setStrokeIDs([...strokeIDs]);
        }
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
                                // strokes.splice(i, 1);
                                deleteStroke(strokeIDs[i]);
                                // updateStrokes(strokes);
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
                let shader = new Shader(color, fill ? color : null, 10, false);
                switch (tool) {
                    case 'rectangle':
                        currentShape = new Rectangle(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    case 'ellipse':
                        currentShape = new Ellipse(p.mouseX, p.mouseY, 0, 0, shader);
                        break;
                    case 'paint':
                        currentShape = new Curve([{ x: p.mouseX, y: p.mouseY }], shader);
                        break;
                    default:
                        console.log("default");
                        break;
                    // case 'select':
                    //     currentShape = new Rectangle(p.mouseX, p.mouseY, 0, 0, shader);
                    //     break;
                }
            };

            p.mouseReleased = function () {
                if (currentShape === null) return;
                console.log(currentShape);
                let shapeType = getShapeType(currentShape);
                if (shapeType === "rectangle" || shapeType === "ellipse") {
                    currentShape.width = p.mouseX - currentShape.x;
                    currentShape.height = p.mouseY - currentShape.y;
                }
                // strokes.push(currentShape);
                // updateStrokes(strokes);
                addStroke(currentShape);
                currentShape = null;
                console.log(strokes);
            };

        };

        const p5Instance = new p5(sketch, sketchRef.current);

        return () => {
            p5Instance.remove();
        };

    }, [tool, color, fill, strokes]);

    return <div className="p5wrapper" ref={sketchRef}></div>;
};

export default P5Wrapper;