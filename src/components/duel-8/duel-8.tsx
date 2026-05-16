import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PHRASES, TEXT } from "./constants";
import "./duel-8.scss";
import { BASE_URL } from "../../constants";

interface Duel8Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

interface PhraseState {
  id: number;
  selectedAnswer: string | null;
  isCorrect: boolean;
  showFeedback: boolean;
}

const Duel8: React.FC<Duel8Props> = ({ onComplete, setShowNextButton }) => {
  const [phrasesState, setPhrasesState] = useState<PhraseState[]>(
    PHRASES.map((phrase) => ({
      id: phrase.id,
      selectedAnswer: null,
      isCorrect: false,
      showFeedback: false,
    }))
  );
  const [allCompleted, setAllCompleted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Запуск фоновой музыки
  useEffect(() => {
    // audioRef.current = new Audio("/sounds/Back-In-Black.mp3");
    audioRef.current = new Audio(`${BASE_URL}/sounds/Back-In-Black.mp3`);

    audioRef.current.volume = 0.25;
    audioRef.current.loop = true;
    audioRef.current.play().catch((e) => console.log("Audio play failed:", e));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSelect = (
    id: number,
    translation: string,
    isCorrect: boolean
  ) => {
    // Проверяем, не выбран ли уже этот фрагмент правильно
    const currentState = phrasesState.find((p) => p.id === id);
    if (currentState?.isCorrect) return;

    setPhrasesState((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selectedAnswer: translation,
              isCorrect,
              showFeedback: true,
            }
          : item
      )
    );

    // Скрываем сообщение через 2 секунды
    setTimeout(() => {
      setPhrasesState((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, showFeedback: false } : item
        )
      );
    }, 2000);

    // Проверяем, все ли переведены
    const updatedState = phrasesState.map((item) =>
      item.id === id ? { ...item, isCorrect } : item
    );

    const allCorrect = updatedState.every((item) => item.isCorrect);
    if (allCorrect && !allCompleted) {
      setAllCompleted(true);
      setShowNextButton(true);
      onComplete();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="duel8-container">
      <div className="duel8-content">
        <motion.h2
          className="duel8-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {TEXT.title}
        </motion.h2>

        <motion.p
          className="duel8-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {TEXT.description}
        </motion.p>

        <motion.p
          className="duel8-instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {TEXT.instruction}
        </motion.p>

        <p className="duel8-subtitle">{TEXT.subtitle}</p>

        <motion.div
          className="phrases-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PHRASES.map((phrase) => {
            const state = phrasesState.find((p) => p.id === phrase.id);
            const isCompleted = state?.isCorrect;
            const allOptions = [
              phrase.correctTranslation,
              ...phrase.wrongTranslations,
            ].sort(() => Math.random() - 0.5); // Перемешиваем варианты

            return (
              <motion.div
                key={phrase.id}
                className={`phrase-card ${isCompleted ? "completed" : ""}`}
                variants={itemVariants}
              >
                <div className="phrase-english">
                  <span className="quote-icon">🎸</span>
                  {phrase.english}
                  <span className="song-name">{phrase.song}</span>
                </div>

                {!isCompleted ? (
                  <div className="translations-grid">
                    {allOptions.map((option, idx) => (
                      <button
                        key={idx}
                        className={`translation-option ${
                          state?.selectedAnswer === option
                            ? state.isCorrect
                              ? "correct-selected"
                              : "wrong-selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleSelect(
                            phrase.id,
                            option,
                            option === phrase.correctTranslation
                          )
                        }
                        disabled={isCompleted}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="completed-area">
                    <span className="completed-icon">✓</span>
                    <span className="completed-text">Переведено!</span>
                  </div>
                )}

                {/* Анимация фидбека */}
                <AnimatePresence>
                  {state?.showFeedback && (
                    <motion.div
                      className={`feedback-small ${
                        state.isCorrect ? "success" : "error"
                      }`}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {state.isCorrect ? (
                        <span>🎸{TEXT.successMessage}</span>
                      ) : (
                        <span>
                          ❌ Не тот перевод. Рок-н-ролл не терпит ошибок!
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Сообщение о завершении */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              className="all-completed-message"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <span className="success-icon">🌍</span>
              <span className="success-text">{TEXT.allCompleted}</span>
              <span className="success-icon">🎤</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Duel8;
