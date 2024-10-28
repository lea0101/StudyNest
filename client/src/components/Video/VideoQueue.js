import React, { useState, useEffect } from 'react';
import {
    query,
    collection,
    onSnapshot,
    addDoc,
    setDoc
} from "firebase/firestore";
import { db } from "../../config/firebase";

function VideoQueue({ setCurrentVideo }) {
    
    let [queue, setQueue] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, "video-queue")
        );
        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const newQueue = [];
            QuerySnapshot.forEach((doc) => {
                let video = doc.data();
                newQueue.push(video);
            });
            const sortedQueue = newQueue.sort((a, b) => a.idx - b.idx);
            setQueue(sortedQueue);
        });
        return () => unsubscribe;
    }, []);

    function addVideo() {
        let videoURL = document.getElementById('addVideoURLInput').value;
        document.getElementById('addVideoURLInput').value = '';
        // fetch video information
        let video = {
            idx: queue.length,
            id: videoURL,
            title: 'Video Title', // TODO: fetch video title
        };
        setQueue([...queue, video]);
        addDoc(collection(db, "video-queue"), video);
    }

    return (
        <div className='video-queue-container'>
            <h2>Video Queue</h2>
            <ol>
                {
                    queue.map((video) => {
                        return <li classname='video-queue-item' key={video.id}><a onClick={() => setCurrentVideo(video.id)}>{video.title}</a></li>;
                    })
                }
            </ol>
            <div>
                <input id="addVideoURLInput" type="text" />
                <button className='b-button' onClick={addVideo}>Add Video</button>
            </div>
        </div>
    );
}

export default VideoQueue;