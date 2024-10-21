import React from 'react';

function YouTubePlayer({ videoId, timestamp, onTimeUpdate }) {
    const [player, setPlayer] = useState(null);

    const onPlayerReady = (event) => {
      setPlayer(event.target);
    }
  
    useEffect(() => {
      if (player) {
        player.seekTo(timestamp);
      }
    }, [timestamp]);
  
    // const onStateChange = (event) => {
    //   if (event.data === YouTube.PlayerState.PLAYING) {
    //     const interval = setInterval(() => {
    //       const currentTime = player.getCurrentTime();
    //       onTimeUpdate(currentTime);
    //     }, 500);
    //     return () => clearInterval(interval);
    //   }
    // }
  
    return <YouTube className="youtube-container" videoId={videoId} onReady={onPlayerReady} onStateChange={onStateChange} />;
}

export default YouTubePlayer;