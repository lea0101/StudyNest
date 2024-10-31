import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

function YouTubePlayer({ videoId, timestamp, onTimeUpdate }) {
    const [player, setPlayer] = useState(null);

    const onPlayerReady = (event) => {
      setPlayer(event.target);
    }
  
    const onStateChange = (event) => {
      if (event.data === YouTube.PlayerState.PLAYING) {
        const interval = setInterval(() => {
          const currentTime = player.getCurrentTime();
          onTimeUpdate(currentTime);
        }, 500);
        return () => clearInterval(interval);
      }
    }
    const opts = {
      height: '500px',
      width: '1000vw',
    };
  
    return <YouTube opts={opts} className="youtube-container" videoId={videoId} onReady={onPlayerReady} onStateChange={onStateChange} />;
}

export default YouTubePlayer;