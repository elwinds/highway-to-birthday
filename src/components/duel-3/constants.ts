import { BASE_URL } from "../../constants";

export const MEMES = [
  {
    id: 1,
    image: `${BASE_URL}/images/memes/boromir.jpg`,
    hasPhoto: true,
    userPhoto: `${BASE_URL}/images/memes/user-boromir.jpg`,
  },
  {
    id: 2,
    image: `${BASE_URL}/images/memes/candibober.jpg`,
    hasPhoto: true,
    userPhoto: `${BASE_URL}/images/memes/user-candibober.jpg`,
  },
  {
    id: 3,
    image: `${BASE_URL}/images/memes/mackonahi.jpg`,
    hasPhoto: true,
    userPhoto: `${BASE_URL}/images/memes/user-mackonahi.jpg`,
  },
  {
    id: 4,
    image: `${BASE_URL}/images/memes/rasskazi.jpg`,
    hasPhoto: true,
    userPhoto: `${BASE_URL}/images/memes/user-rasskazi.jpg`,
  },
  {
    id: 5,
    image: `${BASE_URL}/images/memes/smile.jpg`,
    hasPhoto: true,
    userPhoto: `${BASE_URL}/images/memes/user-smile.jpg`,
  },
  {
    id: 6,
    image: `${BASE_URL}/images/memes/obezyana.jpg`,
    hasPhoto: false,
    userPhoto: null,
  },
];

export const TEXT = {
  title: "Дубль 3: Кадр в кадре",
  description:
    "В жизни каждой рок-звезды есть сцены, которые так и не попали в финальный монтаж.",
  instruction:
    "Сейчас перед тобой 6 легендарных мемов. Для пяти из них в архиве нашлась твоя фотография — идеальное попадание в эмоцию.",
  task: "Но один мем так и остался без твоего участия. Найди потерянный кадр — и мы покажем всю коллекцию!",
  subtitle: "Кликни на мем, у которого нет твоей версии",
  successMessage:
    "Именно этот кадр мы пропустили в прошлый раз. Но теперь у нас есть ты — живая легенда. Сценарий утверждён. Пора на площадку!",
  errorMessage: "Не тот мем. У этого есть твоя версия! Попробуй ещё раз.",
  galleryTitle: "Твоя мем-коллекция:",
};
