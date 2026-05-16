import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SLIDES, PHOTOS, TEXT, FINAL_VIDEO, GUITAR_SOLO } from "./constants";
import "./duel-9.scss";

interface Duel9Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel9: React.FC<Duel9Props> = ({ onComplete, setShowNextButton }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showClosingText, setShowClosingText] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showFinalVideo, setShowFinalVideo] = useState(false);
  const [showFinalText, setShowFinalText] = useState(false);
  const [direction, setDirection] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Запуск музыки с самого начала (с первого слайда)
  useEffect(() => {
    audioRef.current = new Audio(GUITAR_SOLO.src);
    audioRef.current.volume = 0.5;
    audioRef.current.loop = true;
    audioRef.current.play().catch((e) => console.log("Audio play failed:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleNextSlide = () => {
    if (!showPhotos) {
      if (currentSlideIndex < SLIDES.length - 1) {
        setDirection(1);
        setCurrentSlideIndex((prev) => prev + 1);
      } else {
        setShowPhotos(true);
      }
    } else if (showPhotos && !showClosingText) {
      if (currentPhotoIndex < PHOTOS.length - 1) {
        setDirection(1);
        setCurrentPhotoIndex((prev) => prev + 1);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        setShowClosingText(true);
        setTimeout(() => {
          setShowButton(true);
        }, 3000);
      }
    }
  };

  const handleButtonClick = () => {
    setShowButton(false);
    setShowFinalVideo(true);
    setVideoEnded(false);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .catch((e) => console.log("Video play failed:", e));
      }
    }, 100);
  };

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setVideoEnded(false);
    }
  };

  const handleCloseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShowFinalVideo(false);
    setShowFinalText(true);
    onComplete();
    setShowNextButton(true);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
    }),
  };

  const currentSlide = SLIDES[currentSlideIndex];
  const currentPhoto = PHOTOS[currentPhotoIndex];
  const isLastPhoto = currentPhotoIndex === PHOTOS.length - 1;
  const isLastSlide = currentSlideIndex === SLIDES.length - 1;

  // Рендер текстовых слайдов
  if (!showPhotos && !showClosingText && !showFinalVideo && !showFinalText) {
    return (
      <div className="duel9-container">
        <div className="duel9-slider">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlideIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="duel9-slide-content"
            >
              {currentSlide.type === "title" && (
                <h1 className="duel9-title">{currentSlide.title}</h1>
              )}
              {currentSlide.type === "text" && (
                <p className="duel9-text">{currentSlide.content}</p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="duel9-next">
            <button className="duel9-next-button" onClick={handleNextSlide}>
              {isLastSlide ? "К ФОТО" : "ДАЛЬШЕ →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Рендер фото-слайдов
  if (showPhotos && !showClosingText && !showFinalVideo && !showFinalText) {
    return (
      <div className="duel9-container">
        <div className="duel9-slider">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPhotoIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="duel9-photo-slide"
            >
              <img
                src={currentPhoto.image}
                alt={`Фото ${currentPhoto.year}`}
                className="duel9-photo"
              />
              <div className="duel9-year-bottom">{currentPhoto.year}</div>
            </motion.div>
          </AnimatePresence>

          <div className="duel9-progress">
            <div
              className="duel9-progress-fill"
              style={{
                width: `${((currentPhotoIndex + 1) / PHOTOS.length) * 100}%`,
              }}
            />
          </div>

          <div className="duel9-next">
            <button className="duel9-next-button" onClick={handleNextSlide}>
              {isLastPhoto ? "ФИНАЛ" : "ДАЛЬШЕ →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Closing text
  if (showClosingText && !showFinalVideo && !showFinalText) {
    return (
      <div className="duel9-container">
        <div className="closing-text-container">
          <p className="closing-line">{TEXT.closingText}</p>
          <p className="closing-line">{TEXT.closingText2}</p>
          <p className="closing-line">{TEXT.closingText3}</p>
          <p className="closing-line highlight">{TEXT.closingText4}</p>
        </div>
        {showButton && (
          <motion.button
            className="final-button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            onClick={handleButtonClick}
          >
            {TEXT.buttonText}
          </motion.button>
        )}
      </div>
    );
  }

  // Финальное видео (как в дубле 6)
  if (showFinalVideo) {
    return (
      <div className="duel9-container">
        <div className="duel9-content">
          {/* <motion.h2
            className="duel6-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {TEXT.title}
          </motion.h2> */}

          <motion.div
            className="video-container9"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <video
              ref={videoRef}
              className="friends-video"
              onEnded={handleVideoEnd}
              playsInline
              preload="auto"
            >
              <source src={FINAL_VIDEO.src} type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>

            {videoEnded && (
              <button className="replay-button9" onClick={handleReplay}>
                <span>↻</span> {TEXT.replayButton}
              </button>
            )}
          </motion.div>

          {/* <motion.p
            className="duel6-question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {TEXT.loadingText}
          </motion.p> */}
        </div>
      </div>
    );
  }

  // Финальный текст
  return (
    <div className="final-text-container">
      <p className="final-reveal">
        🎸 Камера ждёт тебя за твоей любимой гитарой! 🎸
      </p>
    </div>
  );
};

export default Duel9;
