import React, { useState, useEffect, useRef} from 'react';
import { storage, auth, db } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, listAll, getDownloadURL, uploadBytesResumable, getStorage } from "firebase/storage";
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import FileUploader from "./FileUploader";
import NavBar from "../Home/NavBar";
import "./FileCollab.css";
import { Button, Position, PrimaryButton, Worker, Viewer, Tooltip, SpecialZoomLevel } from '@react-pdf-viewer/core';
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
import { bookmarkPlugin } from '@react-pdf-viewer/bookmark';
import '@react-pdf-viewer/bookmark/lib/styles/index.css';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

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

interface Bookmark {
    pageID: number;
    fileUrl: string;
    userID: string;
    docID: string;
}

const FileViewer = (props) => {
    var [user] = useAuthState(auth);
    var userDisplayName = user.displayName;
    // Get the file url from firebase
    const [ isLoading, setIsLoading ] = useState(true);
    const [ bookmarks, setBookmarks ] = useState([]);
    var shouldUpdateBookmarks = false;
    const [ url, setURL ] = useState(null);
    const { state } = useLocation();

    const [ message, setMessage ] = useState('');
    const [ notes, setNotes ] = useState([]);
    const [ sidebarNotes, setSidebarNotes ] = useState([]);
    let noteId = notes.length;
    const fileName = props.file;
    const currentUID = user.uid;
    const [ currentPage, setCurrentPage ] = useState(1); 

    const noteEles: Map<number, HTMLElement> = new Map();
    const bmarkEles: Map<number, HTMLElement> = new Map();
    const [ isCurrentPageBookmarked, setCurrentPageBookmarked ] = useState(false);

    const viewerRef = useRef(null);

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

    useEffect(() => {
        setBookmarks([]);
        const q = query(collection(db, "file_bookmarks"), where ("fileUrl", "==", fileName));
        const querySnapshot = onSnapshot(q, (QuerySnapshot) => {
            QuerySnapshot.forEach((doc) => {
                if (doc.data().userID === currentUID) {
                    let thisBookmark: Bookmark = {
                        pageID: doc.data().pageID,
                        fileUrl: fileName,
                        userID: doc.data().userID,
                        docID: doc.data().docID
                    };
                    setBookmarks(bookmarks.concat(thisBookmark));
                }
            });
        });
    }, [shouldUpdateBookmarks]);

    shouldUpdateBookmarks = !shouldUpdateBookmarks;

    const handlePageChange = (e) => {
        setCurrentPage(e);
    };

    useEffect(() => {
        const v = bookmarks.filter(b => b.pageID === currentPage.currentPage);
        if (v.length > 0) {
            setCurrentPageBookmarked(true);
        }
        else
        {
            setCurrentPageBookmarked(false);
        }    
    }, [handlePageChange]);

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
            posterID: currentUID,
        };
        addNewNote(note);
    }

    async function addNewNote(note) {
        const docRef = await addDoc(collection(db, "file_notes"), note);
        note.docID = docRef.id;
        await updateDoc(docRef, {docID: docRef.id});
        setNotes(notes.concat([note]));
        setSidebarNotes(sidebarNotes.concat([note]));
    }
    
    const removeNote = (note) =>  {
        deleteNote(note.docID);
    }

    async function deleteNote(noteID) {
        const docRef = doc(db, "file_notes", noteID);
        deleteDoc(docRef)
        .then(() => {
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
                    posterID: currentUID
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
    
    const jumpToNote = (note: Note) => {
        if (noteEles.has(note.id)) {
            noteEles.get(note.id).scrollIntoView();
        }
    }
    const jumpToPage = (pageNumber: number) => {
        if (bmarkEles.has(pageNumber)) {
            bmarkEles.get(pageNumber).scrollIntoView();
        }
    }

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
                                    <React.Fragment key={`${idx}-frag`}
                                    >
                                    <div key={`${idx}-highlightBlock`} style={Object.assign( {},
                                            props.getCssProperties(area, props.rotation)
                                            )}
                                            className="highlight-block"
                                            ref={(ref): void => {
                                            noteEles.set(note.id, ((ref): HTMLElement));
                                        }}>
                                    </div>
                                    </React.Fragment>
                                );
                        }
                        )}
                    </div>
                </React.Fragment>
            ))}
        {bookmarks.map((bookmark) => {
            <React.Fragment key={`${uuidv4()}${bookmark.pageID}`} >
                <div
            style={{
                background: 'none',
                display: 'flex',
                position: 'absolute',
                left: `0`,
                top: `0`,
                transform: 'translate(0, 8px)',
                    zIndex: 1,
                }}
                ref={(ref): void => {
                    bmarkEles.set(bookmark.pageID, ((ref): HTMLElement));
                }}
                />
            </React.Fragment> 
        })
        }
        </div>
    );


    // Configure Default Layout Plugin
    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) =>  [
            {
                content: <div className="sidebar-note-link"> 
                {sidebarNotes.map((note) => {
                    if (note.posterID === currentUID)
                    {
                        if (note.content === "") {
                            var str = note.quote + "...";
                            const maxLen = 30;
                            if (str.length > maxLen) {
                                str = note.quote.substring(0, Math.min(note.quote.length, maxLen)) + "...";
                            }
                            return (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                                <button key={`${uuidv4()}${note.id}`} 
                                    onClick={() => jumpToNote(note)}
                                >Highlighted: {str}</button>
                                <div key={`${uuidv4()}--${note.id}`} className="delete-note">
                                    <button key={`${uuidv4()}${note.id}`} onClick={() => removeNote(note)}>Delete</button>
                                </div>
                                   
                            <p key={`${note.id}-${note.posterDisplayName}`}>By {note.posterDisplayName} (You)</p>                            
                            </React.Fragment>
                            );
                        }
                        return  (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                                <button key={`${uuidv4()}${note.id}`} 
                                    onClick={() => jumpToNote(note)}
                                >{note.content}</button>
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
            {
                content: <div className="sidebar-bookmark-link"> 
                {bookmarks.map((bmark) => {
                            return (
                            <React.Fragment key={`fragment-${uuidv4()}${bmark.id}`}>
                                <button onClick={() => jumpToPage(bmark.pageID)} key={`${uuidv4()}${bmark.id}`}>Page {bmark.pageID+1}</button>
                            </React.Fragment>
                            );
                })}
                </div>,
                icon: <FaBookmark/> ,
                title: "Bookmarks",
            },
        ],
        renderToolbar: (props) => {
            if (isCurrentPageBookmarked) {
            return (
            <div className="toolbar">
                <p className="page-nav-label">Page {currentPage.currentPage + 1}</p>
                <button className="bookmark-button" onClick={() => addBookmark(props)} style={{ padding: '5px 10px' }}>
                    <FaBookmark/>
                </button>
            </div>
        );
            }
            return (
            <div className="toolbar">
                <p className="page-nav-label">Page {currentPage.currentPage + 1}</p>
                <button className="bookmark-button" onClick={() => addBookmark(props)} style={{ padding: '5px 10px' }}>
                    <FaRegBookmark/>
                </button>
            </div>
        );
        }
    });

    const { activateTab } = defaultLayoutPluginInstance;

    const addBookmark = (props) => {
        const bookmarkRef = bookmarks.filter(e => e.pageID === currentPage.currentPage);
        if (bookmarkRef.length === 0) {
            const bookmark : Bookmark = {
                pageID: currentPage.currentPage,
                fileUrl: fileName,
                userID: currentUID,
            }
            uploadBookmarkToDb(bookmark);
            shouldUpdateBookmarks = !shouldUpdateBookmarks;

        }
        else {
            // Delete the bookmark if they click the icon again on the same page
            deleteBookmarkDb(bookmarkRef[0].docID);
        }
    };
    
    async function uploadBookmarkToDb(bookmark) {
        const docRef = await addDoc(collection(db, "file_bookmarks"), bookmark);
        bookmark.docID = docRef.id;
        await updateDoc(docRef, {docID: docRef.id});
        setBookmarks(bookmarks.concat([bookmark]));
    }
    async function deleteBookmarkDb(bookmarkID) {
        const docRef = doc(db, "file_bookmarks", bookmarkID);
        deleteDoc(docRef)
        .then(() => {
            shouldUpdateBookmarks = !shouldUpdateBookmarks;
        })
        .catch(error => {
            console.log(error);
        });
    }
    

   const highlightPluginInstance = highlightPlugin({renderHighlightTarget, renderHighlightContent, renderHighlights});
    if (isLoading) return <p>Loading...</p>;
    else {
        if (!url) {
            return <p>Oops, something went wrong. Try refreshing the page.</p>;
        }
        else {
            return (
            <Viewer className="file-viewer" onPageChange={handlePageChange} fileUrl={url} plugins={[highlightPluginInstance, defaultLayoutPluginInstance]}/>
            );
        }
    }
};


export default FileViewer;
