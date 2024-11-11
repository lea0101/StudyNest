import { useEffect, useState } from 'react';
import YouTubeAPIKey from "../../config/youtube";
import Microlink from '@microlink/react';

const EmbedList = ({ messageText }) => {
  const [embeds, setEmbeds] = useState([]);

  const parseDuration = (isoDuration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);
    const hours = matches[1] ? `${matches[1]}:` : "";
    const minutes = matches[2] ? `${matches[2].padStart(2, '0')}:` : "00:";
    const seconds = matches[3] ? matches[3].padStart(2, '0') : "00";

    return `${hours}${minutes}${seconds}`;
  };

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
    const fetchEmbeds = async () => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = messageText.match(urlRegex);
      if (urls) {
        const embedPromises = urls.map(async (url, index) => {
          if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return <Microlink url={url} key={index} />;
          } else {
            const video = await getVideoDetails(url.split("v=")[1].split('&')[0], index);
            return (
              // <div key={index}>
              //   <img src={video.thumbnail} alt="error rendering" />
              //   <p>{video.title}</p>
              //   <p>{video.duration}</p>
              // </div>
              <a className='video-queue-item' key={index} href={url} target="_blank">
                <div className='video-thumbnail-holder'>
                    <img width="100px" src={video.thumbnail} alt="" />
                    {video.duration && <span className='video-timestamp'>{video.duration}</span>}
                  </div>
                  <span style={{ marginLeft: "10px"}}>{video.title}</span>
              </a>
            );
          }
        });

        // Wait for all async operations to complete
        const resolvedEmbeds = await Promise.all(embedPromises);
        setEmbeds(resolvedEmbeds);
      }
    };

    fetchEmbeds();
  }, [messageText]);

  return <>{embeds}</>;
};

export default EmbedList;