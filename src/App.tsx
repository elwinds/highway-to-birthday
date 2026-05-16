import React, { useState } from "react";
import "./App.css";
import MainSlider from "./components/main-slider/main-slider";
import IntroScreen from "./components/intro-screen/intro-screen";
import "./styles/global.css";
import { useAppState } from "./hooks/use-app-state";
import Duel1 from "./components/duel-1/duel-1";
import NextButton from "./components/next-button/next-button";
import Duel2 from "./components/duel-2/duel-2";
import Duel3 from "./components/duel-3/duel-3";
import Duel4 from "./components/duel-4/duel-4";
import Duel5 from "./components/duel-5/duel-5";
import Duel8 from "./components/duel-8/duel-8";
import Duel7 from "./components/duel-7/duel-7";
import Duel6 from "./components/duel-6/duel-6";
import Duel9 from "./components/duel-9/duel-9";

const App: React.FC = () => {
  const [showSlider, setShowSlider] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);

  const { appState, goToNextDuel, completeDuel } = useAppState();

  console.log(
    "⚠️ Режиссёр не одобряет. Консоль — для кода, а не для читов. Оскар за это не дают. Просто поверь. Вернись к плёнке! 🎬"
  );

  const handleSliderComplete = () => {
    setShowSlider(false);
    setShowIntro(true);
  };

  const handleStartQuest = () => {
    setShowIntro(false);
  };

  const handleDuelComplete = (duelNumber: number) => {
    completeDuel(duelNumber);
  };

  const handleNextDuel = () => {
    if (appState.currentDuel < 9) {
      goToNextDuel();
      setShowNextButton(false);
    }
  };

  const renderCurrentDuel = () => {
    switch (appState.currentDuel) {
      case 1:
        return (
          <Duel1
            onComplete={() => handleDuelComplete(1)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 2:
        return (
          <Duel2
            onComplete={() => handleDuelComplete(2)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 3:
        return (
          <Duel3
            onComplete={() => handleDuelComplete(3)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 4:
        return (
          <Duel4
            onComplete={() => handleDuelComplete(4)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 5:
        return (
          <Duel5
            onComplete={() => handleDuelComplete(5)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 6:
        return (
          <Duel6
            onComplete={() => handleDuelComplete(6)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 7:
        return (
          <Duel7
            onComplete={() => handleDuelComplete(7)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 8:
        return (
          <Duel8
            onComplete={() => handleDuelComplete(8)}
            setShowNextButton={setShowNextButton}
          />
        );
      case 9:
        return (
          <Duel9
            onComplete={() => handleDuelComplete(9)}
            setShowNextButton={setShowNextButton}
          />
        );
      default:
        return (
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              backgroundColor: "#000",
            }}
          >
            (Упс, кто-то напортачил в коде, попробуй начать заново)
          </div>
        );
    }
  };

  if (showSlider) {
    return <MainSlider onComplete={handleSliderComplete} />;
  }

  if (showIntro) {
    return <IntroScreen onStart={handleStartQuest} />;
  }

  return (
    <>
      {renderCurrentDuel()}

      {/* Кнопка "ДАЛЬШЕ" — появляется только после выполнения задания */}
      {showNextButton && appState.currentDuel < 9 && (
        <NextButton
          onClick={handleNextDuel}
          nextDuelNumber={appState.currentDuel + 1}
        />
      )}
    </>
  );
};

export default App;
