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

const Video = () => {
    
    let [timestamp, setTimestamp] = useState(0);
    let [annotations, setAnnotations] = useState([]);
    let [videoId, setVideoId] = useState('');

    useEffect(() => {
        // fetch annotations for the video
        const q = query(
            // TODO: incorporate videoId into query
            collection(db, "youtube-annotations")
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
        });
        return () => unsubscribe;
    }, []);

    async function updateDBTimestamp(newTimestamp) {
        const q = query(
            collection(db, "youtube-timestamps")
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
            collection(db, "youtube-timestamps")
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
        let annotation = {
            timestamp: timestamp,
            text: annotationText
        };
        let left = 0;
        let right = annotations.length - 1;
        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (annotations[mid].timestamp === timestamp) {
                annotations.splice(mid, 0, annotation);
                setAnnotations([...annotations]);
                return;
            } else if (annotations[mid].timestamp < timestamp) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        annotations.splice(left, 0, annotation);
        const docRef = await addDoc(collection(db, "youtube-annotations"), annotation);
        setAnnotations([...annotations]);
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
                                                    <img className="video-annotation-pfp" width="30px" src="https://lh3.googleusercontent.com/a/ACg8ocJ3cmr1ZzLVZ7GHb-Op5LBCDFV2lmCE60THCEnihigz1oh_fQ=s83-c-mo" alt="" />
                                                    <span className="video-annotation-timestamp">{formattedTimestamp}</span>: 
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
            <VideoQueue setCurrentVideo={setVideoId}></VideoQueue>
        </div>
    );
}

export default Video;