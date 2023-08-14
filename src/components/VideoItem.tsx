import React, { useState, useEffect } from "react";
import Hls from "hls.js";
import { VideoItemProps } from "../types";

export const VideoItem: React.FC<VideoItemProps> = React.memo(
  ({ video, isActive, isSwipe }) => {
    const playerRef = React.useRef<HTMLVideoElement>(null!);
    const rangeRef = React.useRef<HTMLInputElement>(null!);

    const [progress, setProgress] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const playVideo = React.useCallback(() => {
      if (playerRef.current) {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }, []);

    const pauseVideo = React.useCallback(() => {
      if (playerRef.current) {
        playerRef.current.pause();
        setIsPlaying(false);
      }
    }, []);

    const handleVideo = React.useCallback(() => {
      if (isPlaying) {
        pauseVideo();
      } else {
        playVideo();
      }
    }, [isPlaying, pauseVideo, playVideo]);

    const handleRangeChange = () => {
      const video = playerRef.current;
      const range = rangeRef.current;
      const seekTime =
        range && (parseInt(range.value, 10) / 100) * video.duration;
      video.currentTime = seekTime;
    };

    const handleTimeUpdate = React.useCallback(() => {
      const currentTime = playerRef.current.currentTime;
      const duration = playerRef.current.duration;
      const calculatedProgress = (currentTime / duration) * 100;
      setProgress(calculatedProgress);
      rangeRef.current.value = calculatedProgress.toString();
    }, []);

    useEffect(() => {
      const playPromise = playerRef.current.play();
      if (playPromise) {
        playPromise
          .then(() => {
            isActive && !isSwipe ? playVideo() : pauseVideo();
          })
          .catch((error: Error) => {
            console.log(error);
          });
      }
    }, [isActive, isSwipe, playVideo, pauseVideo]);

    useEffect(() => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.play_url);
        hls.attachMedia(playerRef.current);
      } else if (
        playerRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        playerRef.current.src = video.play_url;
      }

      playerRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        playerRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }, [video.play_url, handleTimeUpdate]);

    return (
      <div className="video-item">
        <video
          playsInline
          webkit-playsinline="true"
          onClick={handleVideo}
          ref={playerRef}
          controls={false}
          width="100%"
          height="auto"
          autoPlay={true}
          muted={true}
          loop={true}
        />
        <input
          ref={rangeRef}
          className="progressbar"
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleRangeChange}
        />
        <img
          className={`coverBlock ${(isSwipe && isActive) || "hide"}`}
          src={video.cover}
          alt={video.title}
        />
      </div>
    );
  }
);
