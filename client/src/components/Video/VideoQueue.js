import React, { useState, useEffect } from 'react';
import {
    query,
    collection,
    onSnapshot,
    addDoc,
    setDoc
} from "firebase/firestore";
import { db } from "../../config/firebase";
import YouTubeAPIKey from "../../config/youtube";

function VideoQueue({ setCurrentVideo }) {
    
    let [queue, setQueue] = useState([]);
    let [errorMessage, setErrorMessage] = useState('');
    let [showVideoAdd, setShowVideoAdd] = useState(false);

    async function getVideoDetails(video_id, video_idx) {
        // TODO: check if valid video_id
        // fetch video information
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${video_id}&part=snippet,contentDetails&key=${YouTubeAPIKey}`);
        const data = await res.json();

        if (data.items.length === 0) {
            return { idx: video_idx };
        }
        const video_data = data.items[0];
        const title = video_data.snippet.title;
        const thumbnailUrl = video_data.snippet.thumbnails.medium.url;
        const duration = parseDuration(video_data.contentDetails.duration);

        let video = {
            idx: video_idx,
            id: video_id,
            thumbnail: thumbnailUrl,
            title: title,
            duration: duration
        };

        return video;
    }

    useEffect(() => {
        const q = query(
            collection(db, "video-queue")
        );
        const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {
            const newQueue = [];
            QuerySnapshot.forEach((doc) => {
                let video = doc.data();
                newQueue.push(video);
            });
            const sortedQueue = newQueue.sort((a, b) => a.idx - b.idx);
            let detailedSortedQueue = await Promise.all(sortedQueue.map((video) => {
                return getVideoDetails(video.id, video.idx);
            }));
            setQueue(detailedSortedQueue);
        });
        return () => unsubscribe;
    }, []);

    function getVideoID(url) {
        if (!url) {
            setErrorMessage('Please enter a URL');
            return;
        }
        // if url doesn't contain 'v=', it's not a valid youtube video url
        if (url.indexOf('v=') === -1) {
            setErrorMessage('Invalid URL');
            return;
        }
        let video_id = url.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition !== -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        return video_id;
    }
    
    const parseDuration = (isoDuration) => {
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = isoDuration.match(regex);
        const hours = matches[1] ? `${matches[1]}:` : "";
        const minutes = matches[2] ? `${matches[2].padStart(2, '0')}:` : "00:";
        const seconds = matches[3] ? matches[3].padStart(2, '0') : "00";
    
        return `${hours}${minutes}${seconds}`;
    };
    
    async function addVideo() {
        setErrorMessage('');
        let video_id = getVideoID(document.getElementById('addVideoURLInput').value);
        if (!video_id) {
            return;
        }
        document.getElementById('addVideoURLInput').value = '';
        let video = await getVideoDetails(video_id, queue.length);
        if (!video.id) {
            setErrorMessage('Invalid URL');
            return;
        }
        setQueue([...queue, video]);
        addDoc(collection(db, "video-queue"), video);
    }

    return (
        <div className='video-queue-container'>
            <h2>Video Queue</h2>
            <ol>
                {
                    queue.map((video) => {
                        if (!video.id) {
                            return (
                                <li className='video-queue-item' key={video.idx}>
                                    <p>Invalid Video</p>
                                </li>
                            )
                        }
                        return (
                            <li className='video-queue-item' key={video.idx}>
                                <div className='video-thumbnail-holder'>
                                    <img width="100px" src={video.thumbnail} alt="" />
                                    {video.duration && <span className='video-timestamp'>{video.duration}</span>}
                                </div>
                                <a onClick={() => setCurrentVideo(video.id)}>{video.title}</a>
                            </li>
                        );
                    })
                }
            </ol>
            {/* <div> */}
                <button className="dynamic-button" onClick={() => setShowVideoAdd(true)}>Add Video</button>
            {/* </div> */}
            {showVideoAdd && (
            <div className="share-overlay">
                <div className="share">
                    <div className="share-modal"
                    // style={{
                    //     "background-color":
                    //         selectedLight === "light"
                    //         ? "white"
                    //         : selectedLight === "dark"
                    //         ? "rgb(69, 67, 63)"
                    //         : "white",                       
                    // }}
                    >
                        <div className="share-content">
                            <input id="addVideoURLInput" type="text" />
                            <button className='b-button' onClick={addVideo}>Add Video</button>
                            {errorMessage && <p style={{"color": "red"}}>{errorMessage}</p>}
                        </div>
                        <a className="hyperlink" onClick={() => {
                            setShowVideoAdd(false);
                            setErrorMessage('');
                        }}>Close</a>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
}

export default VideoQueue;