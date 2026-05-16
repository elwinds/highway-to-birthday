import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEXT, CORRECT_COORDINATES, TOLERANCE } from "./constants";
import "./duel-2.scss";
import { BASE_URL } from "../../constants";

interface Duel2Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel2: React.FC<Duel2Props> = ({ onComplete, setShowNextButton }) => {
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Запуск фоновой музыки
  useEffect(() => {
    // audioRef.current = new Audio("/sounds/Welcome-to-the-jungle.mp3");
    audioRef.current = new Audio(
      `${BASE_URL}/sounds/Welcome-to-the-jungle.mp3`
    );

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

  const handleSubmit = () => {
    // Парсим введённые координаты
    const parts = inputValue.split(/[ ,]+/);
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);

      if (!isNaN(lat) && !isNaN(lng)) {
        const isLatCorrect =
          Math.abs(lat - CORRECT_COORDINATES.lat) <= TOLERANCE;
        const isLngCorrect =
          Math.abs(lng - CORRECT_COORDINATES.lng) <= TOLERANCE;

        if (isLatCorrect && isLngCorrect) {
          setIsCorrect(true);
          setShowFeedback(true);
          setShowNextButton(true);
          onComplete();
          return;
        }
      }
    }

    // Неправильный ответ
    setIsCorrect(false);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setIsCorrect(null);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Анимация для появления контента
  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <div className="duel2-container">
      <motion.div
        className="duel2-content"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        <h2 className="duel2-title">{TEXT.title}</h2>
        <p className="duel2-description">
          {TEXT.description} <br />
          <span className="highlight">{TEXT.instruction}</span>
        </p>

        <div className="coordinates-input-container">
          <input
            type="text"
            className="coordinates-input"
            placeholder={TEXT.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="coordinates-submit" onClick={handleSubmit}>
            ОПРЕДЕЛИТЬ МЕСТО
          </button>
        </div>

        {/* Анимация фидбека */}
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
                  <span className="feedback-icon">📍</span>
                  <span className="feedback-text">{TEXT.successMessage}</span>
                  <span className="feedback-icon">🎸</span>
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

export default Duel2;
