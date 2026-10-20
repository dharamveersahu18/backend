import React from "react";

const VideoPlayer = ({ src, poster }) => {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-800">
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
