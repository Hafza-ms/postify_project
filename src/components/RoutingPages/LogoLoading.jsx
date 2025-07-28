import React, { useEffect, useRef } from "react";
import postify_logo_sketch from "../../assets/postify_logo_sketch.mp4";

function LogoLoading() {
  const videoRef = useRef(null); 

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; 
    }
  }, []);

  return (
    <div className="logo-background">
      <div className="logo-container">
        <video
          ref={videoRef}
          src={postify_logo_sketch}
          autoPlay
          muted
          loop
          playbackrate="0.5s"
          className="logo-video"
        />
        <div className="loader">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="38"></circle>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LogoLoading;
