export type Mission = {
  title: string;
  reward: number;
  completed: boolean;
  date: string;
};

const STORAGE_KEY = "myfinance-mission";

const DEFAULT_MISSION: Mission = {
  title: "Track one expense",
  reward: 15,
  completed: false,
  date: new Date().toDateString(),
};

export function getMission(): Mission {
  if (typeof window === "undefined") {
    return DEFAULT_MISSION;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    saveMission(DEFAULT_MISSION);
    return DEFAULT_MISSION;
  }

  const mission = JSON.parse(data) as Mission;

  const today = new Date().toDateString();

  if (mission.date !== today) {
    const newMission = {
      ...DEFAULT_MISSION,
      completed: false,
      date: today,
    };

    saveMission(newMission);

    return newMission;
  }

  return mission;
}

export function saveMission(mission: Mission) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(mission)
  );
}

export function completeMission() {
  const mission = getMission();

  mission.completed = true;

  saveMission(mission);
}