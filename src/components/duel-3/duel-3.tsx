import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MEMES, TEXT } from "./constants";
import "./duel-3.scss";

interface Duel3Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel3: React.FC<Duel3Props> = ({ onComplete, setShowNextButton }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Запуск фоновой музыки
  useEffect(() => {
    audioRef.current = new Audio("/sounds/Livin-On-A-Chain-Gang.mp3");
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

  const handleSelect = (id: number, hasPhoto: boolean) => {
    setSelectedId(id);

    if (!hasPhoto) {
      // Правильный ответ — выбран мем без фото
      setIsCorrect(true);
      setShowFeedback(true);
      setShowNextButton(true);
      onComplete();
      // Показываем галерею через 0.5 секунды
      setTimeout(() => {
        setShowGallery(true);
      }, 500);
    } else {
      // Неправильный ответ
      setIsCorrect(false);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setIsCorrect(null);
        setSelectedId(null);
      }, 2500);
    }
  };

  // Анимация для карточек мемов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  };

  const galleryVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  // Фильтруем мемы, которые есть в галерее (те, у которых есть фото)
  const galleryMemes = MEMES.filter((meme) => meme.hasPhoto && meme.userPhoto);

  return (
    <div className="duel3-container">
      <motion.div
        className="duel3-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="duel3-title">{TEXT.title}</h2>
        <p className="duel3-description">
          {TEXT.description} <br />
          {TEXT.instruction} <br />
          <span className="highlight">{TEXT.task}</span>
        </p>
        <p className="duel3-subtitle">{TEXT.subtitle}</p>

        <motion.div
          className="memes-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {MEMES.map((meme) => (
            <motion.div
              key={meme.id}
              className={`meme-card ${
                selectedId === meme.id ? (isCorrect ? "correct" : "wrong") : ""
              }`}
              variants={cardVariants}
              onClick={() => handleSelect(meme.id, meme.hasPhoto)}
            >
              <div className="meme-card-inner">
                <img src={meme.image} className="meme-image" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Анимация фидбека */}
        <AnimatePresence>
          {showFeedback && isCorrect !== null && (
            <motion.div
              className={`feedback-message ${isCorrect ? "success" : "error"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 2.3 }}
            >
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎬</span>
                  <span className="feedback-text">{TEXT.successMessage}</span>
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

        {/* Галерея с фотографиями */}
        <AnimatePresence>
          {showGallery && (
            <motion.div
              className="gallery-container"
              variants={galleryVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <h3 className="gallery-title">{TEXT.galleryTitle}</h3>
              <div className="gallery-grid">
                {MEMES.map((meme) => (
                  <div key={meme.id} className="gallery-card">
                    <div className="gallery-card-inner">
                      {meme.hasPhoto && meme.userPhoto ? (
                        <img
                          src={meme.userPhoto}
                          className="gallery-image"
                        />
                      ) : (
                        <div className="gallery-no-image">
                          <div className="gallery-cross">✕</div>
                          <div className="gallery-no-text">
                            Нет твоей версии
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Duel3;
