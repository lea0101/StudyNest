import React, { useEffect, useState } from 'react';
import YouTubePlayer from './YouTubePlayer';
import VideoQueue from './VideoQueue';
import {
    query,
    collection,
    onSnapshot,
    addDoc,
    setDoc
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import NotAuthorizedPage from "../../Pages/NotAuthorizedPage";

import { useLocation } from 'react-router-dom';

const Video = () => {
    const auth = getAuth();
    const [user, loading] = useAuthState(auth);
    let [timestamp, setTimestamp] = useState(0);
    let [annotations, setAnnotations] = useState([]);
    let [videoId, setVideoId] = useState('');
    let [displayName, setDisplayName] = useState('');
    let [photoURL, setPhotoURL] = useState('');

    const [isAuthorized, setAuthorized] = useState(2);

    const { state } = useLocation(); // retrieve state (roomCode) passed when navigating
    const roomCode = state?.roomCode;

    useEffect(() => {
        console.log("useEffect 1");

        if (loading) {
            return;
        }

        if (roomCode == undefined) {
            setAuthorized(1);
            return;
        }
        
        if (user) {
            if (roomCode == undefined) {
                setAuthorized(1);
                return;
            }
            const roomDocRef = doc(db, 'rooms', roomCode);
            getDoc(roomDocRef).then(doc => {
                 if (doc.exists()) {
                    const userList = doc.data().userList || {};
                    const userInList = Object.values(userList).some(userObj => userObj.uid === user.uid);

                    if (userInList) {
                        setAuthorized(0); // set authorized if user is in userList
                    } else {
                        setAuthorized(1);
                    }
                 } else {
                    setAuthorized(1);
                 }
            }).catch(error => {
                console.error("Error fetching room: ", error);
                setAuthorized(1);
            })
        }
    }, [loading]);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName);
            setPhotoURL(user.photoURL);
        }
    }
    , [loading, user]);

    useEffect(() => {
        // fetch annotations for the video
        const q = query(
            // TODO: incorporate videoId into query
            collection(db, `yt-com-${roomCode}-${videoId}`)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const newAnnotations = [];
            QuerySnapshot.forEach((doc) => {
                let annotation = doc.data();
                // stroke.setID(doc.ref);
                newAnnotations.push(annotation);
            });
            const sortedAnnotations = newAnnotations.sort((a, b) => a.timestamp - b.timestamp);
            setAnnotations(sortedAnnotations);
            console.log('updated annotations', sortedAnnotations);
        });
        return () => unsubscribe;
    }, [videoId]);

    async function updateDBTimestamp(newTimestamp) {
        const q = query(
            collection(db, `yt-time-${roomCode}`)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            QuerySnapshot.forEach((doc) => {
                const docRef = doc.ref;
                setDoc(docRef, { timestamp: newTimestamp });
            });
            setTimestamp(newTimestamp);
        });
        return () => unsubscribe;
    }

    useEffect(() => {
        const q = query(
            collection(db, `yt-time-${roomCode}`)
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            let newTimestamp = timestamp;
            QuerySnapshot.forEach((doc) => {
                const data = doc.data();
                newTimestamp = data.timestamp;
            });
            setTimestamp(newTimestamp);
        });
        return () => unsubscribe;
    }, []);

    async function addAnnotation() {
        console.log('add annotation');
        console.log(annotations);
        let annotationText = document.getElementById('annotationInput').value;
        document.getElementById('annotationInput').value = '';
        if (annotationText === '') {
            return;
        }
        let annotation = {
            displayName: displayName,
            photoURL: photoURL,
            timestamp: timestamp,
            text: annotationText
        };
        let left = 0;
        let right = annotations.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (annotations[mid].timestamp === timestamp) {
                // annotations.splice(mid, 0, annotation);
                // setAnnotations([...annotations]);
                left = mid;
                break;
            } else if (annotations[mid].timestamp < timestamp) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        annotations.splice(left, 0, annotation);
        const docRef = await addDoc(collection(db, `yt-com-${roomCode}-${videoId}`), annotation);
        setAnnotations([...annotations]);
        console.log('added new annotation', annotation, annotations);
    }

    if (isAuthorized == 1) {
        return <NotAuthorizedPage/>
    } else if (isAuthorized == 2){
        return <div> Loading... </div>
    }

    return (
        <div className='video-preview-container'>
            <div>
                <div className='annotation-container'>
                    <ul>
                        {
                            annotations.filter((annotation) => Math.abs(timestamp - annotation.timestamp) < 3)
                                        .map((annotation, index) => {
                                                const formattedTimestamp = new Date(annotation.timestamp * 1000).toISOString().substr(11, 8);
                                                return (
                                                <li className="video-annotation"key={index}>
                                                    <img className="video-annotation-pfp" width="30px" src={annotation.photoURL} alt="" />
                                                    <span className='video-annotation-text'>{annotation.displayName}</span>
                                                    <span className="video-annotation-timestamp">{formattedTimestamp}</span> 
                                                    <span className="video-annotation-text">{annotation.text}</span>
                                                </li>);
                                            }
                                        )
                        }
                    </ul>
                    <YouTubePlayer videoId={videoId} timestamp={timestamp} onTimeUpdate={updateDBTimestamp}/>
                </div>
                <div>
                    <input id="annotationInput" type="text" />
                    <button className='b-button' onClick={addAnnotation}>Submit</button>
                </div>
            </div>
            <VideoQueue roomCode={roomCode} setCurrentVideo={setVideoId}></VideoQueue>
        </div>
    );
}

export default Video;