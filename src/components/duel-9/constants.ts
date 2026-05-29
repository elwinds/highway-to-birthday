import { BASE_URL } from "../../constants";

export const PHOTOS = [
  { id: 1, year: 1995, image: `${BASE_URL}/images/photos/years/1995.jpg` },
  { id: 2, year: 1996, image: `${BASE_URL}/images/photos/years/1996.jpg` },
  { id: 3, year: 1997, image: `${BASE_URL}/images/photos/years/1997.jpg` },
  { id: 4, year: 1998, image: `${BASE_URL}/images/photos/years/1998.jpg` },
  { id: 5, year: 1999, image: `${BASE_URL}/images/photos/years/1999.jpg` },
  { id: 6, year: 2001, image: `${BASE_URL}/images/photos/years/2001.jpg` },
  { id: 7, year: 2002, image: `${BASE_URL}/images/photos/years/2002.jpg` },
  { id: 8, year: 2004, image: `${BASE_URL}/images/photos/years/2004.jpg` },
  { id: 9, year: 2005, image: `${BASE_URL}/images/photos/years/2005.jpg` },
  { id: 10, year: 2006, image: `${BASE_URL}/images/photos/years/2006.jpg` },
  { id: 11, year: 2008, image: `${BASE_URL}/images/photos/years/2008.jpg` },
  { id: 12, year: 2010, image: `${BASE_URL}/images/photos/years/2010.jpg` },
  { id: 13, year: 2013, image: `${BASE_URL}/images/photos/years/2013.jpg` },
  { id: 14, year: 2015, image: `${BASE_URL}/images/photos/years/2015.jpg` },
  { id: 15, year: 2016, image: `${BASE_URL}/images/photos/years/2016.jpg` },
  { id: 16, year: 2017, image: `${BASE_URL}/images/photos/years/2017.jpg` },
  { id: 17, year: 2018, image: `${BASE_URL}/images/photos/years/2018.jpg` },
  { id: 18, year: 2020, image: `${BASE_URL}/images/photos/years/2020.jpg` },
  { id: 19, year: 2021, image: `${BASE_URL}/images/photos/years/2021.jpg` },
  { id: 20, year: 2022, image: `${BASE_URL}/images/photos/years/2022.jpg` },
  { id: 21, year: 2023, image: `${BASE_URL}/images/photos/years/2023.jpg` },
  { id: 22, year: 2024, image: `${BASE_URL}/images/photos/years/2024.jpg` },
  { id: 23, year: 2025, image: `${BASE_URL}/images/photos/years/2025.jpg` },
];

export const SLIDES = [
  {
    id: 1,
    type: "title",
    title: "Дубль 9: Финал",
  },
  {
    id: 2,
    type: "text",
    content: "Плёнка почти закончилась. Остался последний, самый важный кадр.",
  },
  {
    id: 3,
    type: "text",
    content:
      "Фильм под названием 'Highway To Birthday' подходит к своему финалу. Но это не конец — это только начало нового сезона.",
  },
  {
    id: 4,
    type: "text",
    content:
      "Настало время посмотреть, как много мы уже сняли, и узнать, что ждёт тебя в финале.",
  },
];

export const TEXT = {
  title: "Дубль 9: Финал",
  description:
    "Плёнка почти закончилась. Остался последний, самый важный кадр.",
  instruction:
    "Фильм под названием 'Highway To Birthday' подходит к своему финалу. Но это не конец — это только начало нового сезона.",
  task: "Давай посмотрим, как много мы уже сняли, и узнаем, где спрятана камера для новых приключений.",
  closingText: "Твой 31-й день рождения...",
  closingText2: "Кадр не найден.",
  closingText3: "Потому что лучшие кадры еще впереди.",
  closingText4: "Возьми камеру и сними их сам.",
  buttonText: "УЗНАТЬ, ГДЕ ЛЕЖИТ КАМЕРА",
  loadingText: "Загрузка финальной сцены...",
  replayButton: "ПОВТОРИТЬ",
};

export const FINAL_VIDEO = {
  src: `${BASE_URL}/videos/friends-message.mp4`, // видео с друзьями, песня уже встроена
};

export const GUITAR_SOLO = {
  src: `${BASE_URL}/sounds/Sweet-Child-O-Mine.mp3`, // гитарное соло для слайд-шоу
};
