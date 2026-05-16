import { useState, useCallback } from "react";
import { AppState } from "../types";

const initialState: AppState = {
  currentDuel: 1,
  completedDuels: [],
  duelsStatus: {},
};

export const useAppState = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem("highway-to-birthday");
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  // Сохраняем в localStorage при каждом изменении
  const updateAppState = useCallback((newState: AppState) => {
    setAppState(newState);
    localStorage.setItem("highway-to-birthday", JSON.stringify(newState));
  }, []);

  // Сеттер с поддержкой частичного обновления
  const setAppStateField = useCallback(
    <K extends keyof AppState>(name: K, value: AppState[K]) => {
      updateAppState({ ...appState, [name]: value });
    },
    [appState, updateAppState]
  );

  // Переход к следующему дублю
  const goToNextDuel = useCallback(() => {
    if (appState.currentDuel < 9) {
      updateAppState({
        ...appState,
        currentDuel: appState.currentDuel + 1,
      });
    }
  }, [appState, updateAppState]);

  // Отметить дубль как пройденный
  const completeDuel = useCallback(
    (duelNumber: number) => {
      if (appState.completedDuels.includes(duelNumber)) return;

      updateAppState({
        ...appState,
        completedDuels: [...appState.completedDuels, duelNumber],
        duelsStatus: { ...appState.duelsStatus, [duelNumber]: true },
      });
    },
    [appState, updateAppState]
  );

  // Проверить, пройден ли дубль
  const isDuelCompleted = useCallback(
    (duelNumber: number) => {
      return appState.completedDuels.includes(duelNumber);
    },
    [appState.completedDuels]
  );

  // Сбросить весь прогресс (на случай, если захочешь перепройти)
  const resetProgress = useCallback(() => {
    updateAppState(initialState);
  }, [updateAppState]);

  return {
    appState,
    setAppState: updateAppState,
    setAppStateField,
    goToNextDuel,
    completeDuel,
    isDuelCompleted,
    resetProgress,
  };
};
