import React, { useState, useEffect } from 'react';

function VideoQueue({ setCurrentVideo }) {
    
    let [queue, setQueue] = useState([]);

    useEffect(() => {
        // fetch videos in the queue
    }, []);

    function addVideo() {
        let videoURL = document.getElementById('addVideoURLInput').value;
        document.getElementById('addVideoURLInput').value = '';
        // fetch video information
        let video = {
            id: videoURL,
            title: 'Video Title', // TODO: fetch video title
        };
        setQueue([...queue, video]);
    }

    return (
        <div>
            <h2>Video Queue</h2>
            <ol>
                {
                    queue.map((video) => {
                        return <li key={video.id}><a onClick={() => setCurrentVideo(video.id)}>{video.title}</a></li>;
                    })
                }
            </ol>
            <div>
                <input id="addVideoURLInput" type="text" />
                <button onClick={addVideo}>Add Video</button>
            </div>
        </div>
    );
}

export default VideoQueue;