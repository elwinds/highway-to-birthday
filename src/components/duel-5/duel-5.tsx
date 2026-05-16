import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEXT, WAIT_TIME } from "./constants";
import "./duel-5.scss";
import { BASE_URL } from "../../constants";

interface Duel5Props {
  onComplete: () => void;
  setShowNextButton: (show: boolean) => void;
}

const Duel5: React.FC<Duel5Props> = ({ onComplete, setShowNextButton }) => {
  const [buttonState, setButtonState] = useState<
    "initial" | "ready" | "pressed"
  >("initial");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Звуковые эффекты
  const warningSoundRef = useRef<HTMLAudioElement | null>(null);
  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);
  const guitarRiffSoundRef = useRef<HTMLAudioElement | null>(null);

  // Инициализация звуков
  useEffect(() => {
    // warningSoundRef.current = new Audio("/sounds/warning.mp3");
    warningSoundRef.current = new Audio(`${BASE_URL}/sounds/warning.mp3`);
    explosionSoundRef.current = new Audio(`${BASE_URL}/sounds/explosion.mp3`);
    guitarRiffSoundRef.current = new Audio(
      `${BASE_URL}/sounds/guitar-riff.mp3`
    );


    // explosionSoundRef.current = new Audio("/sounds/explosion.mp3");
    // guitarRiffSoundRef.current = new Audio("/sounds/guitar-riff.mp3");

    // Настройка громкости
    if (warningSoundRef.current) warningSoundRef.current.volume = 0.4;
    if (explosionSoundRef.current) explosionSoundRef.current.volume = 0.5;
    if (guitarRiffSoundRef.current) guitarRiffSoundRef.current.volume = 0.6;

    return () => {
      if (warningSoundRef.current) {
        warningSoundRef.current.pause();
        warningSoundRef.current = null;
      }
      if (explosionSoundRef.current) {
        explosionSoundRef.current.pause();
        explosionSoundRef.current = null;
      }
      if (guitarRiffSoundRef.current) {
        guitarRiffSoundRef.current.pause();
        guitarRiffSoundRef.current = null;
      }
    };
  }, []);

  // Запускаем таймер при монтировании компонента
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, []);

  const startTimer = () => {
    setButtonState("initial");
    setProgress(0);
    setShowFeedback(false);
    setIsSuccess(false);

    // Прогресс-бар анимация
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / WAIT_TIME) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (progressIntervalRef.current)
          clearInterval(progressIntervalRef.current);
      }
    }, 16);

    // Таймер на 5 секунд
    timerRef.current = setTimeout(() => {
      setButtonState("ready");
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      setProgress(100);

      // Проигрываем звук предупреждения
      if (warningSoundRef.current) {
        warningSoundRef.current.currentTime = 0;
        warningSoundRef.current
          .play()
          .catch((e) => console.log("Warning sound error:", e));
      }
    }, WAIT_TIME);
  };

  const playGuitarRiff = () => {
    if (guitarRiffSoundRef.current) {
      guitarRiffSoundRef.current.currentTime = 0;
      guitarRiffSoundRef.current
        .play()
        .catch((e) => console.log("Guitar riff error:", e));
    }
  };

  const playExplosion = () => {
    if (explosionSoundRef.current) {
      explosionSoundRef.current.currentTime = 0;
      explosionSoundRef.current
        .play()
        .catch((e) => console.log("Explosion sound error:", e));
    }
  };

  const handleButtonClick = () => {
    if (buttonState === "ready") {
      // Правильный взрыв!
      setButtonState("pressed");
      setIsSuccess(true);
      setShowFeedback(true);

      // Проигрываем сначала взрыв, потом гитарный рифф
      playExplosion();

      // Небольшая задержка перед гитарным риффом для эффекта
      setTimeout(() => {
        playGuitarRiff();
      }, 300);

      // Встряска экрана
      document.body.classList.add("shake");
      setTimeout(() => {
        document.body.classList.remove("shake");
      }, 500);

      // Показываем сообщение об успехе и активируем кнопку дальше
      setTimeout(() => {
        setShowNextButton(true);
        onComplete();
      }, 1500);
    } else if (buttonState === "initial") {
      // Нажали слишком рано
      setIsSuccess(false);
      setShowFeedback(true);

      // Останавливаем таймеры
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);

      // Сбрасываем через 2 секунды
      setTimeout(() => {
        setShowFeedback(false);
        startTimer();
      }, 2000);
    }
  };

  // Анимация пульсации для кнопки
  const pulseAnimation = {
    scale: buttonState === "ready" ? [1, 1.08, 1.08, 1] : 1,
    transition: {
      duration: 0.6,
      repeat: buttonState === "ready" ? Infinity : 0,
      repeatType: "loop" as const,
    },
  };

  const explosionAnimation = {
    scale: [1, 1.3, 0.9, 1.1, 1],
    rotate: [0, -8, 8, -5, 5, 0],
    transition: { duration: 0.4 },
  };

  return (
    <div className="duel5-container">
      <div className="duel5-content">
        <motion.h2
          className="duel5-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {TEXT.title}
        </motion.h2>

        <motion.p
          className="duel5-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {TEXT.description}
        </motion.p>

        <motion.p
          className="duel5-instruction"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {TEXT.instruction}
        </motion.p>

        {/* Прогресс-бар напряжения */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${progress}%`,
              background:
                buttonState === "ready"
                  ? "linear-gradient(90deg, #ffd700, #ff6600, #ff0000)"
                  : "linear-gradient(90deg, #ff0000, #ff6600, #ffd700)",
            }}
          />
          <div className="progress-text">
            {buttonState === "ready"
              ? "💥 МАКСИМАЛЬНОЕ НАПРЯЖЕНИЕ! ЖМИ! 💥"
              : buttonState === "pressed"
              ? "💣 ВЗРЫВ! 💣"
              : `${Math.floor(progress)}%`}
          </div>
        </div>

        {/* Кнопка-детонатор */}
        <motion.button
          className={`detonator-button ${buttonState}`}
          animate={
            buttonState === "pressed"
              ? explosionAnimation
              : buttonState === "ready"
              ? pulseAnimation
              : {}
          }
          onClick={handleButtonClick}
          whileHover={{ scale: buttonState === "ready" ? 1.05 : 1 }}
        >
          {buttonState === "initial" && TEXT.buttonInitial}
          {buttonState === "ready" && (
            <>
              <span className="button-icon">💀</span>
              {TEXT.buttonReady}
              <span className="button-icon">💀</span>
            </>
          )}
          {buttonState === "pressed" && TEXT.buttonPressed}
        </motion.button>

        {/* Анимация фидбека */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              className={`feedback-message ${isSuccess ? "success" : "error"}`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              {isSuccess ? (
                <>
                  <span className="feedback-icon">🎸</span>
                  <span className="feedback-text">{TEXT.successMessage}</span>
                  <span className="feedback-icon">💥</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">⚠️</span>
                  <span className="feedback-text">{TEXT.warningMessage}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Огненные искры при взрыве */}
        {buttonState === "pressed" && (
          <div className="fireworks">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="spark"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 400 - 100,
                  scale: Math.random() * 2.5 + 0.5,
                  opacity: 0,
                }}
                transition={{
                  duration: Math.random() * 0.8 + 0.6,
                  ease: "easeOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  position: "absolute",
                }}
              >
                {Math.random() > 0.6 ? "💥" : Math.random() > 0.5 ? "✨" : "🎸"}
              </motion.div>
            ))}
          </div>
        )}

        {/* Нотки, летящие при взрыве */}
        {buttonState === "pressed" && (
          <div className="music-notes">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="music-note"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  rotate: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 300,
                  y: -Math.random() * 200 - 50,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: Math.random() * 1.5 + 0.8,
                  ease: "easeOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  position: "absolute",
                  fontSize: "1.5rem",
                }}
              >
                {["♪", "♫", "🎸", "🎵"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Duel5;
