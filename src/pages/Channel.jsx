import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Main from '../components/section/Main';
import VideoSearch from '../components/videos/VideoSearch';

import { CiBadgeDollar } from "react-icons/ci";
import { CiMedal } from "react-icons/ci";
import { CiRead } from "react-icons/ci";

const Channel = () => {
  const { channelId } = useParams();
  const [channelDetail, setChannelDetail] = useState();
  const [channelVideo, setChannelVideo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 채널 정보
        const response = await fetch(
          `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          setChannelDetail(data.items[0]);
        } else {
          console.error("채널 정보를 가져오지 못했습니다:", data);
        }

        // 채널 비디오
        const videoResponse = await fetch(
          `https://youtube.googleapis.com/youtube/v3/search?channelId=${channelId}&part=snippet,id&order=date&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
        );
        const videosData = await videoResponse.json();

        setChannelVideo(videosData?.items || []);
        setNextPageToken(videosData?.nextPageToken || null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [channelId]);

  // 추가 영상 로드 (직접 fetch)
  const loadMoreVideos = async () => {
    if (nextPageToken) {
      const videoResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?channelId=${channelId}&part=snippet,id&order=date&pageToken=${nextPageToken}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`
      );
      const videosData = await videoResponse.json();

      setChannelVideo((prevVideos) => [...prevVideos, ...videosData.items]);
      setNextPageToken(videosData?.nextPageToken || null);
    }
  };

  const channelPageClass = loading ? 'isLoading' : 'isLoaded';

  return (
    <Main title="유튜브 채널" description="유튜브 채널페이지입니다.">
      <section id="channel" className={channelPageClass}>
        {channelDetail && (
          <div className="channel__inner">
            {/* 채널 헤더 */}
            <div
              className="channel__header"
              style={{
                backgroundImage: `url(${channelDetail?.brandingSettings?.image?.bannerExternalUrl})`,
              }}
            >
              <div className="circle">
                <img
                  src={channelDetail.snippet.thumbnails.high.url}
                  alt={channelDetail.snippet.title}
                />
              </div>
            </div>

            {/* 채널 정보 */}
            <div className="channel__info">
              <h3 className="title">{channelDetail.snippet.title}</h3>
              <p className="desc">{channelDetail.snippet.description}</p>
              <div className="info">
                <span>
                  <CiBadgeDollar /> {channelDetail.statistics.subscriberCount} 구독자
                </span>
                <span>
                  <CiMedal /> {channelDetail.statistics.videoCount} 동영상
                </span>
                <span>
                  <CiRead /> {channelDetail.statistics.viewCount} 조회수
                </span>
              </div>
            </div>

            {/* 채널 비디오 */}
            <div className="channel__video video__inner search">
              <VideoSearch videos={channelVideo} />
            </div>

            {/* 더 보기 버튼 */}
            <div className="channel__more">
              {nextPageToken && (
                <button onClick={loadMoreVideos}>더 보기</button>
              )}
            </div>
          </div>
        )}
      </section>
    </Main>
  );
};

export default Channel;