import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SONGS, TEXT } from "./constants";
import "./duel-4.scss";

interface Duel4Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

interface SongGuess {
  id: number;
  guess: string;
  isCorrect: boolean;
  showFeedback: boolean;
  feedbackType: "success" | "partial" | "error" | null;
}

const Duel4: React.FC<Duel4Props> = ({ onComplete, setShowNextButton }) => {
  const [guesses, setGuesses] = useState<SongGuess[]>(
    SONGS.map((song) => ({
      id: song.id,
      guess: "",
      isCorrect: false,
      showFeedback: false,
      feedbackType: null,
    }))
  );
  const [allCompleted, setAllCompleted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const checkGuess = (id: number, userGuess: string) => {
    const song = SONGS.find((s) => s.id === id);
    if (!song) return;

    const normalizedGuess = userGuess.toLowerCase().trim();

    // Проверяем, соответствует ли введённое значение одному из правильных вариантов
    const isExactMatch = song.correctAnswers.some(
      (answer) => normalizedGuess === answer.toLowerCase()
    );

    // Проверка на частичное совпадение (для "похоже")
    const isPartialMatch = song.correctAnswers.some(
      (answer) =>
        answer.toLowerCase().includes(normalizedGuess) ||
        normalizedGuess.includes(answer.toLowerCase())
    );

    let feedbackType: "success" | "partial" | "error" = "error";
    let isCorrect = false;

    if (isExactMatch) {
      feedbackType = "success";
      isCorrect = true;
    } else if (isPartialMatch && normalizedGuess.length > 2) {
      feedbackType = "partial";
      isCorrect = true;
    } else {
      feedbackType = "error";
      isCorrect = false;
    }

    setGuesses((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              guess: userGuess,
              isCorrect,
              showFeedback: true,
              feedbackType,
            }
          : item
      )
    );

    // Скрываем сообщение через 2 секунды
    setTimeout(() => {
      setGuesses((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, showFeedback: false } : item
        )
      );
    }, 2000);

    // Проверяем, все ли песни угаданы
    const updatedGuesses = guesses.map((item) =>
      item.id === id ? { ...item, isCorrect } : item
    );

    const allCorrect = updatedGuesses.every((item) => item.isCorrect);
    if (allCorrect && !allCompleted) {
      setAllCompleted(true);
      setShowNextButton(true);
      onComplete();
    }
  };

  const playAudio = (id: number, audioFile: string) => {
    // Останавливаем текущее воспроизведение
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    audioRef.current = new Audio(audioFile);
    audioRef.current.volume = 0.7;
    setPlayingId(id);

    audioRef.current.play().catch((e) => console.log("Audio play failed:", e));

    audioRef.current.onended = () => {
      setPlayingId(null);
    };
  };

  const handleInputChange = (id: number, value: string) => {
    setGuesses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, guess: value } : item))
    );
  };

  const handleKeyPress = (id: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const guess = guesses.find((g) => g.id === id);
      if (guess && guess.guess.trim()) {
        checkGuess(id, guess.guess);
      }
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
    <div className="duel4-container">
      <motion.div
        className="duel4-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="duel4-title">{TEXT.title}</h2>
        <p className="duel4-description">{TEXT.description}</p>
        <p className="duel4-instruction">{TEXT.instruction}</p>

        <motion.div
          className="songs-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {SONGS.map((song) => {
            const guess = guesses.find((g) => g.id === song.id);
            const isCompleted = guess?.isCorrect;

            return (
              <motion.div
                key={song.id}
                className={`song-card ${isCompleted ? "completed" : ""}`}
                variants={itemVariants}
              >
                <div className="song-header">
                  <div className="song-artist">{song.artist}</div>
                  <button
                    className={`play-button ${
                      playingId === song.id ? "playing" : ""
                    }`}
                    onClick={() => playAudio(song.id, song.audioFile)}
                    disabled={isCompleted}
                  >
                    {playingId === song.id ? (
                      <span className="play-icon">⏸</span>
                    ) : (
                      <span className="play-icon">▶</span>
                    )}
                    {playingId === song.id ? "ИГРАЕТ" : "ПРОСЛУШАТЬ"}
                  </button>
                </div>

                {!isCompleted ? (
                  <div className="guess-area">
                    <input
                      type="text"
                      className="guess-input"
                      placeholder={TEXT.placeholder}
                      value={guess?.guess || ""}
                      onChange={(e) =>
                        handleInputChange(song.id, e.target.value)
                      }
                      onKeyPress={(e) => handleKeyPress(song.id, e)}
                      disabled={isCompleted}
                    />
                    <button
                      className="check-button"
                      onClick={() => {
                        if (guess?.guess.trim()) {
                          checkGuess(song.id, guess.guess);
                        }
                      }}
                      disabled={isCompleted}
                    >
                      {TEXT.checkButton}
                    </button>
                  </div>
                ) : (
                  <div className="completed-area">
                    <span className="completed-icon">✓</span>
                    <span className="completed-text">Угадано!</span>
                  </div>
                )}

                {/* Анимация фидбека */}
                <AnimatePresence>
                  {guess?.showFeedback && guess.feedbackType && (
                    <motion.div
                      className={`feedback-small ${guess.feedbackType}`}
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {guess.feedbackType === "success" && (
                        <span>✅ Верно! {song.name}</span>
                      )}
                      {guess.feedbackType === "partial" && (
                        <span>🎵 {TEXT.partialMessage}</span>
                      )}
                      {guess.feedbackType === "error" && (
                        <span>❌ {TEXT.errorMessage}</span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Сообщение о завершении всех песен */}
        <AnimatePresence>
          {allCompleted && (
            <motion.div
              className="all-completed-message"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <span className="success-icon">🎸</span>
              <span className="success-text">{TEXT.allCompleted}</span>
              <span className="success-text">{TEXT.successMessage}</span>
              <span className="success-icon">🎸</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Duel4;
