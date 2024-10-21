import React, { useEffect, useState } from 'react';
import YouTubePlayer from './YouTubePlayer';
import VideoQueue from './VideoQueue';

const Video = () => {
    
    let [timestamp, setTimestamp] = useState(0);
    let [annotations, setAnnotations] = useState([]);
    let [videoId, setVideoId] = useState('');

    useEffect(() => {
        // fetch annotations for the video
    }, [videoId]);

    useEffect(() => {
        // fetch videos in the queue
    }, []);

    function addAnnotation() {
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
        setAnnotations([...annotations]);
    }

    return (
        <div>
            <div>
                <YouTubePlayer videoId={videoId} timestamp={timestamp} onTimeUpdate={setTimestamp}/>
                <input id="annotationInput" type="text" />
                <button onSubmit={addAnnotation}>Submit</button>
            </div>
            <VideoQueue setCurrentVideo={setVideoId}></VideoQueue>
        </div>
    );
}

export default Video;