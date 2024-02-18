import { defineStore } from 'pinia';

interface TotalTime {
  id: string;
  time: number;
}

 export const useTotalCookingTime = defineStore({
  id: 'TotalCookingTime',
  state: (): { time: TotalTime | null } => ({
    time: JSON.parse(localStorage.getItem('TotalCookingTime') || 'null'),
  }),
  actions: {
    totalTime(time: TotalTime) {
      this.time = time;
      localStorage.setItem('TotalCookingTime', JSON.stringify(time));
    },
  },
});
