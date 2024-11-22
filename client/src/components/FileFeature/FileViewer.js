import React, { useState, useEffect, useRef} from 'react';
import { storage, auth, db } from '../../config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigate, useLocation } from 'react-router-dom';
import "./FileCollab.css";
import { Button, Position, PrimaryButton, Viewer, Tooltip, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { pdfjs } from "react-pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { HighlightArea, SelectionData, highlightPlugin, RenderHighlightTargetProps, RenderHighlightContentProps, MessageIcon, RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { FaHighlighter } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css';
import { v4 as uuidv4 } from 'uuid';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/bookmark/lib/styles/index.css';
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import type { RenderCurrentPageLabel, RenderCurrentPageLabelProps } from '@react-pdf-viewer/thumbnail';
import { TiDeleteOutline } from "react-icons/ti";

import { useRoomSettings } from "../Room/RoomSettingsContext";
import { useTimer } from "../Timer/TimerContext";

import type { RenderThumbnailItemProps } from '@react-pdf-viewer/thumbnail';


import {
    query,
    collection,
    onSnapshot,
    addDoc,
    doc,
    deleteDoc,
    where,
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
    const { selectedColor, selectedLight, contextUserRole } = useRoomSettings(); // access color & light and user role settings
    const { isTimerDone, isActive, resetTimerStatus } = useTimer(); // access timer

    const colorMapping = {
        default: "#6fb2c5",
        red: "rgb(217, 91, 91)",
        orange: "rgb(204, 131, 53)",
        yellow: "rgb(245, 227, 125)",
        green: "rgb(118, 153, 93)",
        blue: "rgb(59, 124, 150)",
        purple: "rgb(165, 132, 224)",
        pink: "rgb(242, 170, 213)"  
    };
    const buttonColor = colorMapping[selectedColor || colorMapping.default];
    
    var [user] = useAuthState(auth);
    var userDisplayName = user.displayName;
    // Get the file url from firebase
    const [ isLoading, setIsLoading ] = useState(true);
    const [ bookmarks, setBookmarks ] = useState([]);
    const [ shouldUpdateBookmarks, setShouldUpdateBookmarks ] = useState(false);
    const [ url, setURL ] = useState(null);

    const [ message, setMessage ] = useState('');
    const [ notes, setNotes ] = useState([]);
    const [ sidebarNotes, setSidebarNotes ] = useState([]);
    let noteId = notes.length;
    const fileName = props.file;
    const currentUID = user.uid;
    const [ currentPage, setCurrentPage ] = useState(1); 

    const noteEles: Map<number, HTMLElement> = new Map();
    const [ isCurrentPageBookmarked, setCurrentPageBookmarked ] = useState(false);

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

    useEffect(() => {
    }, [shouldUpdateBookmarks]);


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
                zIndex: 15,
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
                content={() => <div style={{ width: '100px', zIndex: 16, position: 'sticky' }}>Highlight selection</div>}
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
                    zIndex: 8,
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
                                            <div className="note-info-tooltip" style={{backgroundColor: buttonColor}}>
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
                                            }}
                                    >
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

    
    const renderCurrentPageLabel: RenderCurrentPageLabel = (props: RenderCurrentPageLabelProps) => {
        return (
        <>
            {props.pageIndex + 1}
            {props.pageLabel !== `${props.pageIndex + 1}` && `(${props.pageLabel})`}
        </>
        );
    };

    const thumbnailPluginInstance = thumbnailPlugin({
        renderCurrentPageLabel,
    });

    const { Thumbnails } = thumbnailPluginInstance;

    const renderThumbnailItem = (props: RenderThumbnailItemProps) => {
        const bookmarkRef = bookmarks.filter(e => e.pageID === props.pageIndex);
        if (bookmarkRef.length === 0) {
            return (
                <div key={props.key}>
                    <div onClick={props.onJumpToPage}>
                        {props.renderPageThumbnail}
                    </div>
                    {props.renderPageLabel}
                </div>
            );
        }
        else {
            return (
                <div key={props.key}>
                    <div onClick={props.onJumpToPage}>
                        {props.renderPageThumbnail}
                    </div>
                    <FaBookmark/> {props.renderPageLabel}
                </div>
            );
        }
    };

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
                            const maxLen = 50;
                            if (str.length > maxLen) {
                                str = note.quote.substring(0, Math.min(note.quote.length, maxLen)) + "...";
                            }
                            return (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                                <div onClick={() => jumpToNote(note)} key={`div-${uuidv4()}${note.id}`} className="sidebar-item">
                                <p className="sidebar-note-content" key={`${uuidv4()}${note.id}`} 
                                    onClick={() => jumpToNote(note)}
                                >Highlighted: {str}</p>
                                <div key={`${uuidv4()}--${note.id}`} className="delete-note">
                                    <button key={`${uuidv4()}${note.id}`} onClick={() => removeNote(note)}><TiDeleteOutline /></button>
                                </div>
                                   
                            <p className="sidebar-note-name" key={`${note.id}-${note.posterDisplayName}`}>By {note.posterDisplayName} (You)</p>                        
                                </div>
                            </React.Fragment>
                            );
                        }
                        return  (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                        <div key={`div-${uuidv4()}${note.id}`} className="sidebar-item"
                            onClick={() => jumpToNote(note)}>
                                <p key={`${uuidv4()}${note.id}`} className="sidebar-note-content" 
                                >{note.content}</p>
                                <div key={`${uuidv4()}--${note.id}`} className="delete-note">
                                    <button key={`${uuidv4()}${note.id}`} onClick={() => removeNote(note)}><TiDeleteOutline /></button>
                                </div>
                                   
                            <p className="sidebar-note-name" key={`${note.id}-${note.posterDisplayName}`}>By {note.posterDisplayName} (You)</p>                            
                            </div>
                            </React.Fragment>
                        );
                    }
                    else
                    {
                        if (note.content === "") {
                            var str = note.quote + "...";
                            const maxLen = 50;
                            if (str.length > maxLen) {
                                str = note.quote.substring(0, Math.min(note.quote.length, maxLen)) + "...";
                            }
                            return (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                                <div onClick={() => jumpToNote(note)} key={`div-${uuidv4()}${note.id}`} className="sidebar-item">
                                <p className="sidebar-note-content" key={`${uuidv4()}${note.id}`} 
                                    onClick={() => jumpToNote(note)}
                                >Highlighted: {str}</p>
                                <div key={`${uuidv4()}--${note.id}`} className="delete-note">
                                </div>
                                   
                            <p className="sidebar-note-name" key={`${note.id}-${note.posterDisplayName}`}>By {note.posterDisplayName} (You)</p>                        
                                </div>
                            </React.Fragment>
                            );
                        }
                        return  (
                            <React.Fragment key={`fragment-${uuidv4()}${note.id}`}>
                        <div key={`div-${uuidv4()}${note.id}`} className="sidebar-item"
                            onClick={() => jumpToNote(note)}>
                                <p key={`${uuidv4()}${note.id}`} className="sidebar-note-content" 
                                >{note.content}</p>
                                <div key={`${uuidv4()}--${note.id}`} className="delete-note">
                                </div>
                                   
                            <p className="sidebar-note-name" key={`${note.id}-${note.posterDisplayName}`}>By {note.posterDisplayName} (You)</p>                            
                            </div>
                            </React.Fragment>
                        );

                    }
                })}
                </div>,
                icon: <MessageIcon />,
                title: 'Notes',
            },
            {
                content: <Thumbnails renderThumbnailItem={renderThumbnailItem}/>,
                icon: <FaRegBookmark/>,
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

        }
        else {
            // Delete the bookmark if they click the icon again on the same page
            deleteBookmarkDb(bookmarkRef[0].docID);
        }
        setShouldUpdateBookmarks(!shouldUpdateBookmarks);
    };
    
    async function uploadBookmarkToDb(bookmark) {
        const docRef = await addDoc(collection(db, "file_bookmarks"), bookmark);
        bookmark.docID = docRef.id;
        await updateDoc(docRef, {docID: docRef.id});
    }
    async function deleteBookmarkDb(bookmarkID) {
        const docRef = doc(db, "file_bookmarks", bookmarkID);
        deleteDoc(docRef)
        .then(() => {
            setBookmarks(bookmarks.filter(bmark => bmark.docID !== bookmarkID));
            setShouldUpdateBookmarks(!shouldUpdateBookmarks);
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
            <Viewer className="file-viewer" defaultScale={SpecialZoomLevel.PageWidth} onPageChange={handlePageChange} fileUrl={url} plugins={[highlightPluginInstance, defaultLayoutPluginInstance, thumbnailPluginInstance]}/>
            );
        }
    }
};


export default FileViewer;
