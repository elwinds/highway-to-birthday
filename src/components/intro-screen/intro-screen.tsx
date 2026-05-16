import React, { useRef, useEffect } from "react";
import "./intro-screen.scss";

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Запускаем музыку при монтировании компонента
    audioRef.current = new Audio("/sounds/intro-music.mp3");
    audioRef.current.volume = 0.4;
    audioRef.current.loop = true;
    audioRef.current.play().catch((e) => console.log("Audio play failed:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleStart = () => {
    // Останавливаем музыку при клике на кнопку
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onStart();
  };

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <p className="intro-text">
          Чтобы узнать, где лежит сценарий к этому дню, <br />
          тебе нужно перейти в режим{" "}
          <span className="highlight">"Режиссёра"</span>
        </p>
        <button className="play-button" onClick={handleStart}>
          <div className="play-button-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="play-button-text">ЗАПУСТИТЬ ПЛЁНКУ</span>
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
