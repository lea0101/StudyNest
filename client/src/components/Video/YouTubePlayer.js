import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

function YouTubePlayer({ videoId, timestamp, onTimeUpdate, videoState, setVideoState }) {
    const [player, setPlayer] = useState(null);
    const [playerReady, setPlayerReady] = useState(false);

    // update timestamp if updated
    useEffect(() => {
      if (!playerReady) {
        return;
      }
      if (videoId && player && timestamp && Math.abs(player.getCurrentTime() - timestamp) > 1) {
        player.seekTo(timestamp);
      }
    }, [playerReady, timestamp, player]);

    // update video state if updated
    useEffect(() => {
      if (!playerReady) {
        return;
      }
      if (player && videoState) {
        if (videoState === 1) {
          player.playVideo();
        } else if (videoState === 2) {
          player.pauseVideo();
        }
      }
    }, [playerReady, videoState, player]);
    
    const onPlayerReady = (event) => {
      setPlayer(event.target);
    }
  
    const onStateChange = (event) => {
      setPlayerReady(true);
      if (event.data === YouTube.PlayerState.PLAYING) {
        // update video state to playing
        setVideoState(1);
        const interval = setInterval(() => {
          const currentTime = player.getCurrentTime();
          console.log(currentTime);
          onTimeUpdate(currentTime);
        }, 500);
        return () => clearInterval(interval);
      } else if (event.data === YouTube.PlayerState.PAUSED) {
        // update video state to paused
        setVideoState(2);
      }
    }
    const opts = {
      height: '500px',
      width: '1000vw',
    };
  
    return <YouTube opts={opts} className="youtube-container" videoId={videoId} onReady={onPlayerReady} onStateChange={onStateChange} />;
}

export default YouTubePlayer;