import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SLIDES } from "./constants";
import "./main-slider.scss";

interface SliderProps {
  onComplete: () => void; // вызывается, когда слайдер закончился и нужно показать экран с кнопкой
}

const MainSlider: React.FC<SliderProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Запуск музыки при монтировании компонента
  useEffect(() => {
    audioRef.current = new Audio("/sounds/highway-to-hell.mp3");
    audioRef.current.loop = true; // зацикливаем, чтобы бесконечно играла
    audioRef.current.volume = 0.5;

    audioRef.current.play().catch((e) => {
      console.log("Автовоспроизведение заблокировано браузером.");
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Разблокируем аудио при первом клике
  const handleNext = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch((e) => console.log(e));
    }

    if (currentIndex < SLIDES.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Это последний слайд (постер) — нажали "В КИНО"
      // Останавливаем музыку перед переходом
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      onComplete();
    }
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

  const textVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.8,
        ease: "easeOut" as const,
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.8,
        ease: "easeOut" as const,
      },
    },
  };

  const currentSlide = SLIDES[currentIndex];
  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <div className="main-slider-container">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="main-slider-content"
        >
          {currentSlide.type === "text" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              <div className="main-slider-text-title">{currentSlide.title}</div>
              <h2 className="main-slider-text">{currentSlide.content}</h2>
            </motion.div>
          )}

          {currentSlide.type === "title" && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={textVariants}
            >
              <h1 className="main-slider-title">{currentSlide.title}</h1>
              <p className="main-slider-subtitle">{currentSlide.subtitle}</p>
            </motion.div>
          )}

          {currentSlide.type === "image" && (
            <motion.img
              initial="hidden"
              animate="visible"
              variants={imageVariants}
              src={currentSlide.src}
              alt={currentSlide.alt}
              className="main-slider-image"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Индикаторы прогресса */}
      <div className="main-slider-indicators">
        {SLIDES.map((_, idx) => (
          <div
            key={idx}
            className={`main-slider-indicator ${
              idx === currentIndex ? "active" : ""
            }`}
          />
        ))}
      </div>

      {/* Кнопка "Дальше" / "В КИНО" */}
      <div className="main-slider-next">
        <button className="main-slider-next-button" onClick={handleNext}>
          {isLastSlide ? "В КИНО" : "ДАЛЬШЕ →"}
        </button>
      </div>
    </div>
  );
};

export default MainSlider;
