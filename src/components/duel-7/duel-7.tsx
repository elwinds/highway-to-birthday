import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { PHOTOS, TEXT, SUCCESS_MESSAGES } from "./constants";
import "./duel-7.scss";
import { BASE_URL } from "../../constants";

interface Duel7Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel7: React.FC<Duel7Props> = ({ onComplete, setShowNextButton }) => {
  const [photos, setPhotos] = useState(PHOTOS);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

   const audioRef = useRef<HTMLAudioElement | null>(null);

   // Запуск фоновой музыки
   useEffect(() => {
    //  audioRef.current = new Audio("/sounds/Crazy-Train.mp3");
     audioRef.current = new Audio(`${BASE_URL}/sounds/Crazy-Train.mp3`);

     audioRef.current.volume = 0.3;
     audioRef.current.loop = true;
     audioRef.current.play().catch((e) => console.log("Audio play failed:", e));

     return () => {
       if (audioRef.current) {
         audioRef.current.pause();
         audioRef.current = null;
       }
     };
   }, []);

  useEffect(() => {
    shufflePhotos();
  }, []);

  const shufflePhotos = () => {
    const shuffled = [...PHOTOS].sort(() => Math.random() - 0.5);
    setPhotos(shuffled);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const checkOrder = () => {
    const correctOrderIds = PHOTOS.map((photo) => photo.id);
    const currentOrderIds = photos.map((photo) => photo.id);

    let isOrderCorrect = true;
    for (let i = 0; i < correctOrderIds.length; i++) {
      if (correctOrderIds[i] !== currentOrderIds[i]) {
        isOrderCorrect = false;
        break;
      }
    }

    if (isOrderCorrect) {
      const randomMessage =
        SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)];
      setSuccessMessage(randomMessage);
      setIsCorrect(true);
      setShowFeedback(true);
      setShowNextButton(true);
      onComplete();
    } else {
      setIsCorrect(false);
      setShowFeedback(true);

      document.body.classList.add("shake");
      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 500);

      setTimeout(() => {
        setShowFeedback(false);
        setIsCorrect(null);
      }, 2000);
    }
  };

  const openFullscreen = (imageSrc: string) => {
    setFullscreenImage(imageSrc);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
    document.body.style.overflow = "";
  };

  // Простая анимация для карточек (без задержек)
  const cardVariants = {
    dragging: {
    //   scale: 1.02,
      boxShadow: "0 10px 30px rgba(255, 215, 0, 0.3)",
      borderColor: "#ffd700",
      transition: { duration: 0.1 },
    },
  };

  return (
    <div className="duel7-container">
      <div className="duel7-content">
        <motion.h2
          className="duel7-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {TEXT.title}
        </motion.h2>

        <motion.p
          className="duel7-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {TEXT.description}
        </motion.p>

        <motion.p
          className="duel7-instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {TEXT.instruction}
        </motion.p>

        <p className="duel7-task">{TEXT.task}</p>

        <div className="shuffle-notice">{TEXT.shuffleNotice}</div>
        <Reorder.Group
          axis="y"
          values={photos}
          onReorder={setPhotos}
          className="photos-list"
        >
          {photos.map((photo, index) => (
            <Reorder.Item
              key={photo.id}
              value={photo}
              className="photo-item"
              whileDrag="dragging"
              variants={cardVariants}
              dragListener={true}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            >
              <div className="photo-number">{index + 1}</div>
              <div
                className="photo-image-wrapper"
                onClick={() => openFullscreen(photo.image)}
              >
                <img
                  src={photo.image}
                  alt={`Фото ${photo.id}`}
                  className="photo-image"
                  draggable={false}
                />
              </div>
              <div className="drag-handle">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="9" cy="12" r="2" fill="currentColor" />
                  <circle cx="15" cy="12" r="2" fill="currentColor" />
                  <circle cx="9" cy="6" r="2" fill="currentColor" />
                  <circle cx="15" cy="6" r="2" fill="currentColor" />
                  <circle cx="9" cy="18" r="2" fill="currentColor" />
                  <circle cx="15" cy="18" r="2" fill="currentColor" />
                </svg>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="action-buttons">
          <button className="check-button" onClick={checkOrder}>
            {TEXT.checkButton}
          </button>
          <button className="reset-button-7" onClick={shufflePhotos}>
            {TEXT.resetButton}
          </button>
        </div>

        <AnimatePresence>
          {showFeedback && isCorrect !== null && (
            <motion.div
              className={`feedback-message ${isCorrect ? "success" : "error"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎬</span>
                  <span className="feedback-text">
                    {successMessage || TEXT.successMessage}
                  </span>
                  <span className="feedback-icon">✨</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">❌</span>
                  <span className="feedback-text">{TEXT.errorMessage}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen модальное окно */}
      {fullscreenImage && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <div
            className="fullscreen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fullscreenImage}
              alt="Фото"
              className="fullscreen-image"
            />
            <button className="fullscreen-close" onClick={closeFullscreen}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Duel7;
