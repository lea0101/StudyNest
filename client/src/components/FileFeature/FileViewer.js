import React, { useState, useEffect } from 'react';
import { storage, auth, db } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../Home/NavBar";
import "./FileCollab.css";
import { Button, Position, PrimaryButton, Worker, Viewer, Tooltip } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { HighlightArea, SelectionData, highlightPlugin, RenderHighlightTargetProps, RenderHighlightContentProps, MessageIcon, RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { TiMessage } from "react-icons/ti";

import {
    query,
    collection,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    where,
    getDocs
} from "firebase/firestore";

interface RenderHighlightProp {
    fileUrl: string;
}

interface Note {
    id: number;
    content: string;
    highlightAreas: HighlightArea[];
    quote: string;
    fileUrl: string;
}

const FileViewer = (props) => {
    // Get the file url from firebase
    const [ numPages, setNumPages ] = useState(null);
    const [ pageNumber, setPageNumber ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ url, setURL ] = useState(null);
    const { state } = useLocation();

    const [ message, setMessage ] = useState('');
    const [ notes, setNotes ] = useState([]);
    let noteId = notes.length;
    const fileName = props.file;

    useEffect(() => {
        getDownloadURL(ref(storage, fileName))
            .then((url) => {
                setURL(url);
                setInterval(() => setIsLoading(false), 500);
            }).catch(() => setIsLoading(false));
        // Now get the notes already in the file, if existing.
        const q = query(collection(db, "file_notes"), where("fileUrl", "==", fileName));
        const querySnapshot = onSnapshot(q, (QuerySnapshot) => {
            let fetchedNotes = [];
            QuerySnapshot.forEach((doc) => {
                let thisNote: Note = {
                    id: doc.data().id,
                    content: doc.data().content,
                    highlightAreas: doc.data().highlightAreas,
                    quote: doc.data().quote,
                    fileUrl: doc.data().fileUrl
                };
                fetchedNotes.push(thisNote);
            });
            setNotes(fetchedNotes);
        });

        return ()  => q;
    }, []);

    const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
        <div
            style={{
                background: '#eee',
                display: 'flex',
                position: 'absolute',
                left: `${props.selectionRegion.left}%`,
                top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                transform: 'translate(0, 8px)',
                zIndex: 1,
            }}
        >
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={props.toggle}>
                        <MessageIcon />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Add a note</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    async function addNewNote(note) {
        console.log("adding new note");
        console.log(note);
        const docRef = await addDoc(collection(db, "file_notes"), note);
        setNotes(notes.concat([note]));
    }

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                    fileUrl: fileName
                };
                addNewNote(note);
                props.cancel();
            }
        };
        return (
            <div
                style={{
                    background: '#fff',
                    border: '1px solid rgba(0, 0, 0, .3)',
                    borderRadius: '2px',
                    padding: '8px',
                    position: 'absolute',
                    left: `${props.selectionRegion.left}%`,
                    top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
                    zIndex: 1,
                }}
            >
                <div>
                    <textarea
                        rows={3}
                        style={{
                            border: '1px solid rgba(0, 0, 0, .3)',
                        }}
                        onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                </div>
                <div
                    style={{
                        display: 'flex',
                        marginTop: '8px',
                    }}
                >
                    <div style={{ marginRight: '8px' }}>
                        <PrimaryButton onClick={addNote}>Add</PrimaryButton>
                    </div>
                    <Button onClick={props.cancel}>Cancel</Button>
                </div>
            </div>
        );
    };
    
    
    const renderHighlights = (props: RenderHighlightsProps) => (
        <div>
            {notes.map((note) => (
                <React.Fragment key={note.id}>
                    {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => (
                            <div
                                key={idx}
                                style={Object.assign(
                                    {},
                                    {
                                        background: 'yellow',
                                        opacity: 0.4,
                                    },
                                    props.getCssProperties(area, props.rotation)
                                )}
                                data-tooltip-id={`tooltip-${note.id}`}
                                data-tooltip-content={note.content}
                            />
                        ))}
               <Tooltip
                position={Position.TopCenter}
                offset={{ left: 0, top: -8 }}
                key={`tooltip-${note.id}`}
                id={`tooltip-${note.id}`}
                />
                </React.Fragment>

            ))}
        </div>
    );

    const highlightPluginInstance = highlightPlugin({renderHighlightTarget, renderHighlightContent, renderHighlights});

    if (isLoading) return <p>Loading...</p>;
    else {
        if (!url) {
            return <p>Oops, something went wrong. Try refreshing the page.</p>;
        }
        else {
            return (
            <div className="file-viewer-container">
                <div className="file-viewer">
                    <Viewer fileUrl={url} plugins={[highlightPluginInstance]}/>
                </div>
             </div>
            );
        }
    }
};


export default FileViewer;
