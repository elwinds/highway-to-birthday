import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GUEST_STAR, TEXT, CORRECT_ANSWERS } from "./constants";
import "./duel-6.scss";

interface Duel6Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel6: React.FC<Duel6Props> = ({ onComplete, setShowNextButton }) => {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.log("Auto-play blocked:", e));
    }
  }, []);

  const handleSubmit = () => {
    const normalizedAnswer = answer.toLowerCase().trim();
    const isAnswerCorrect = CORRECT_ANSWERS.some(
      (correct) => normalizedAnswer === correct
    );

    if (isAnswerCorrect) {
      setIsCorrect(true);
      setShowFeedback(true);
      setShowNextButton(true);
      onComplete();

      const successSound = new Audio("/sounds/success.mp3");
      successSound.volume = 0.3;
      successSound.play().catch((e) => console.log(e));
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
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

  return (
    <div className="duel6-container">
      <div className="duel6-content">
        <motion.h2
          className="duel6-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {TEXT.title}
        </motion.h2>

        <motion.div
          className="video-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <video
            ref={videoRef}
            className="star-video"
            onEnded={handleVideoEnd}
            playsInline
            preload="auto"
          >
            <source src={GUEST_STAR.videoSrc} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>

          {videoEnded && (
            <button className="replay-button" onClick={handleReplay}>
              <span>↻</span> {TEXT.replayButton}
            </button>
          )}
        </motion.div>

        <motion.p
          className="duel6-question"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {TEXT.question}
        </motion.p>

        <motion.div
          className="answer-area"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <input
            type="text"
            className="answer-input"
            placeholder={TEXT.placeholder}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="submit-button" onClick={handleSubmit}>
            {TEXT.buttonText}
          </button>
        </motion.div>

        <AnimatePresence>
          {showFeedback && isCorrect !== null && (
            <motion.div
              className={`feedback-message6 ${isCorrect ? "success" : "error"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {isCorrect ? (
                <>
                  <span className="feedback-icon">{TEXT.successIcons[0]}</span>
                  <span className="feedback-text">{TEXT.correctMessage}</span>
                  <span className="feedback-icon">{TEXT.successIcons[1]}</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">{TEXT.errorIcons[0]}</span>
                  <span className="feedback-text">{TEXT.errorMessage}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Duel6;
