export type AppState = {
  currentDuel: number;
  completedDuels: number[];
  duelsStatus: Record<number, boolean>;
};

export type DuelProps = {
  onComplete: () => void;
  isActive: boolean;
  setShowNextButton: (show: boolean) => void;
};
