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
        const fullURL = `https://www.youtube.com/watch?v=${videoURL}`;

        fetch(`https://noembed.com/embed?dataType=json&url=${fullURL}`)
        .then(res => res.json())
        .then(data => {
            let video = {
                idx: queue.length,
                id: videoURL,
                title: data.title,
            };
            setQueue([...queue, video]);
            addDoc(collection(db, "video-queue"), video);
        });

    }

    return (
        <div className='video-queue-container'>
            <h2>Video Queue</h2>
            <ol>
                {
                    queue.map((video) => {
                        const imgURL = `https://img.youtube.com/vi/${video.id}/0.jpg`;
                        return (
                            <li className='video-queue-item' key={video.id}>
                                <img width="80px" src={imgURL} alt="" />
                                <a onClick={() => setCurrentVideo(video.id)}>{video.title}</a>
                            </li>
                        );
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