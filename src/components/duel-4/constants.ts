import { BASE_URL } from "../../constants";

export const SONGS = [
  {
    id: 1,
    name: "Paradise City",
    artist: "Трек №1",
    // audioFile: "/sounds/paradise-city-short.mp3",
    audioFile: `${BASE_URL}/sounds/paradise-city-short.mp3`,

    correctAnswers: ["paradise city", "paradise", "city"],
  },
  {
    id: 2,
    name: "Girls In Black",
    artist: "Трек №2",
    // audioFile: "/sounds/girls-in-black-short.mp3",
    audioFile: `${BASE_URL}/sounds/girls-in-black-short.mp3`,

    correctAnswers: ["girls in black", "girls in black", "girls"],
  },
  {
    id: 3,
    name: "Enter Sandman",
    artist: "Трек №3",
    // audioFile: "/sounds/enter-sandman-short.mp3",
    audioFile: `${BASE_URL}/sounds/enter-sandman-short.mp3`,

    correctAnswers: ["enter sandman", "sandman", "enter"],
  },
];

export const TEXT = {
  title: "Дубль 4: Звукорежиссёр",
  description: "Выбери саундтреки, пока соседи не вызвали полицию",
  instruction: "Прослушай отрывок и введи название песни (без исполнителя)",
  placeholder: "Введи название песни...",
  checkButton: "ПРОВЕРИТЬ",
  successMessage: "Звук записан. Микрофон не сломан!",
  partialMessage: "Ты не фанат, но мы тебя простим. Забирай ноту!",
  errorMessage: "Не угадал. Попробуй ещё раз!",
  allCompleted: "Все треки угаданы!",
};

export const ALLOWED_MISTAKES = [
  { wrong: "paradise", correct: "Paradise City" },
  { wrong: "girls", correct: "Girls In Black" },
  { wrong: "sandman", correct: "Enter Sandman" },
];
