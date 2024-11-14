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
import { FaHighlighter } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import { SelectionMode } from '@react-pdf-viewer/selection-mode';
import { v4 as uuidv4 } from 'uuid';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { BookmarkIcon, FileIcon, ThumbnailIcon } from '@react-pdf-viewer/default-layout';
import { SidebarTab } from '@react-pdf-viewer/default-layout';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

import {
    query,
    collection,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    where,
    getDocs,
    updateDoc
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
    posterDisplayName: string;
    posterID: string;
    docID: string;
}

const FileViewer = (props) => {
    var [user] = useAuthState(auth);
    var userDisplayName = user.displayName;
    // Get the file url from firebase
    const [ numPages, setNumPages ] = useState(null);
    const [ pageNumber, setPageNumber ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ url, setURL ] = useState(null);
    const { state } = useLocation();

    const [ message, setMessage ] = useState('');
    const [ notes, setNotes ] = useState([]);
    const [ sidebarNotes, setSidebarNotes ] = useState([]);
    let noteId = notes.length;
    const fileName = props.file;
    const currentUID = user.uid;


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
                    fileUrl: doc.data().fileUrl,
                    posterDisplayName: doc.data().posterDisplayName,
                    posterID: doc.data().posterID,
                    docID: doc.data().docID,
                };
                fetchedNotes.push(thisNote);
            });
            setNotes(fetchedNotes);
            setSidebarNotes(fetchedNotes);
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
            <Tooltip
                position={Position.TopCenter}
                target={
                    <Button onClick={(event) => addHighlight(props)}>
                        <FaHighlighter />
                    </Button>
                }
                content={() => <div style={{ width: '100px' }}>Highlight selection</div>}
                offset={{ left: 0, top: -8 }}
            />
        </div>
    );

    function addHighlight(props) {
        var note: Note = {
            id: ++noteId,
            content: "",
            highlightAreas: props.highlightAreas,
            quote: props.selectedText,
            fileUrl: fileName,
            posterDisplayName: userDisplayName,
            posterID: user.uid,
        };
        addNewNote(note);
    }

    async function addNewNote(note) {
        const docRef = await addDoc(collection(db, "file_notes"), note);
        note.docID = docRef.id;
        await updateDoc(docRef, {docID: docRef.id});
        setNotes(notes.concat([note]));
        setSidebarNotes(sidebarNotes.concat([note.content]));
    }
    
    const removeNote = (note) =>  {
        console.log(note.docID);
        deleteNote(note.docID);
    }

    async function deleteNote(noteID) {
        const docRef = doc(db, "file_notes", noteID);
        deleteDoc(docRef)
        .then(() => {
            console.log("Deleted successfully.");
        })
        .catch(error => {
            console.log(error);
        });
    }

    const renderHighlightContent = (props: RenderHighlightContentProps) => {
        const addNote = () => {
            if (message !== '') {
                const note: Note = {
                    id: ++noteId,
                    content: message,
                    highlightAreas: props.highlightAreas,
                    quote: props.selectedText,
                    fileUrl: fileName,
                    posterDisplayName: userDisplayName,
                    posterID: user.uid
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
                className="add-note-dialog"
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
                <React.Fragment key={`${uuidv4()}${note.id}`} >
                    <div key={`${note.id}-tooltipContainer`} className='tooltip-container'>
                        {note.highlightAreas
                        .filter((area) => area.pageIndex === props.pageIndex)
                        .map((area, idx) => {
                            if (idx === 0) {
                                if (note.content !== '') {
                                return (
                                    <React.Fragment key={`${idx}-fragment`}>
                                    <div key={`${idx}-highlight`} style={Object.assign( {},
                                            props.getCssProperties(area, props.rotation)
                                            )}
                                            className="highlight-block"
                                    />
                                        <div  key={`${idx}-floatingbox`} style={Object.assign( {}, 
                                            props.getCssProperties(area, props.rotation)
                                            )}
                                        >
                                            <div className="note-info-tooltip" >
                                                <p>
                                                <strong>{note.posterDisplayName}:</strong> {note.content}</p>
                                            </div>
                                        </div>

                                    </React.Fragment>
                                );
                                }
                            }
                                return (
                                    <React.Fragment key={`${idx}-frag`}>
                                    <div key={`${idx}-highlightBlock`} style={Object.assign( {},
                                            props.getCssProperties(area, props.rotation)
                                            )}
                                            className="highlight-block">
                                    </div>
                                    </React.Fragment>
                                );
                        }
                        )}
                    </div>
                </React.Fragment>

            ))}
        </div>
    );

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) =>  [
            {
                content: <div className="sidebar-note-link"> 
                {sidebarNotes.map((note) => {
                    if (note.posterID === currentUID)
                    {
                        return  (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                                <button key={`${uuidv4()}${note.id}`}  >{note.content}</button>
                                <div key={`${uuidv4()}--${note.id}`} className="delete-note">
                                    <button key={`${uuidv4()}${note.id}`} onClick={() => removeNote(note)}>Delete</button>
                                </div>
                                   
                            <p key={`${note.id}-${note.posterDisplayName}`}>By {note.posterDisplayName} (You)</p>                            
                            </React.Fragment>
                        );
                    }
                    else
                    {
                        return  (
                            <>
                                <button key={`${uuidv4()}${note.id}`}  >{note.content}</button>
                                <p>By {note.posterDisplayName}</p>                            
                            </>
                        );
                    }
                })}
                </div>,
                icon: <MessageIcon />,
                title: 'Notes',
            },
            defaultTabs[1],
        ],
    });
    const { activateTab } = defaultLayoutPluginInstance;

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
                    <Viewer fileUrl={url} plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}/>
                </div>
             </div>
            );
        }
    }
};


export default FileViewer;
