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

    function addAnnotation() {
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
        setAnnotations([...annotations]);
    }

    return (
        <div>
            <div>
                <YouTubePlayer videoId={videoId} timestamp={timestamp} onTimeUpdate={setTimestamp}/>
                <div>
                    <h2>Annotations</h2>
                    <ul>
                        {
                            annotations.filter((annotation) => Math.abs(timestamp - annotation.timestamp) < 5)
                                        .map((annotation, index) => {
                                                return <li key={index}>{annotation.timestamp}: {annotation.text}</li>;
                                            }
                                        )
                        }
                    </ul>
                </div>
                <div>
                    <input id="annotationInput" type="text" />
                    <button onClick={addAnnotation}>Submit</button>
                </div>
            </div>
            <VideoQueue setCurrentVideo={setVideoId}></VideoQueue>
        </div>
    );
}

export default Video;