import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./duel-1.scss";
import { STAR_MAPS, TEXT } from "./constants";

interface Duel1Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel1: React.FC<Duel1Props> = ({ onComplete, setShowNextButton }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Запуск фоновой музыки
  useEffect(() => {
    audioRef.current = new Audio("/sounds/Shoot-to-thrill.mp3");
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

  const handleSelect = (id: number, isCorrectAnswer: boolean) => {
    setSelectedId(id);
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);

    if (isCorrectAnswer) {
      setShowNextButton(true);
      onComplete();
    } else {
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedId(null);
      }, 1500);
    }
  };

  // Исправленные анимации с as const
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div className="duel1-container">
      <motion.div
        className="duel1-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="duel1-title">{TEXT.title}</h2>
        <p className="duel1-description">
          {TEXT.description} <br />
          {TEXT.instruction} <br />
          <span className="highlight">{TEXT.highlight}</span>
        </p>

        <motion.div
          className="stars-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {STAR_MAPS.map((starMap) => (
            <motion.div
              key={starMap.id}
              className={`star-card ${
                selectedId === starMap.id
                  ? isCorrect
                    ? "correct"
                    : "wrong"
                  : ""
              }`}
              variants={cardVariants}
              onClick={() => handleSelect(starMap.id, starMap.isCorrect)}
            >
              <div className="star-card-inner">
                <img
                  src={starMap.src}
                  alt={starMap.name}
                  className="star-image"
                />
                <div className="star-card-overlay">
                  <span className="star-card-name">{starMap.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
                  <span className="feedback-icon">✨</span>
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
      </motion.div>
    </div>
  );
};

export default Duel1;
