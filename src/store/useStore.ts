import { create } from 'zustand';
import type { CalcInput, CalcResult, Substance } from '../types';
import { SUBSTANCES } from '../data/substances';
import { calculate } from '../calc/calculator';

interface AppStore {
  // форма
  selectedSubstance: Substance;
  mass: number;
  congestion: 1 | 2 | 3 | 4;
  position: 'ground' | 'air';
  cloudType: 'gas' | 'dust';

  // результат
  result: CalcResult | null;
  isCalculating: boolean;

  // активная вкладка результатов
  activeTab: 'chart' | 'table' | 'map';

  // координаты эпицентра на карте
  epicenter: [number, number];

  // действия
  setSubstance: (s: Substance) => void;
  setMass: (m: number) => void;
  setCongestion: (c: 1 | 2 | 3 | 4) => void;
  setPosition: (p: 'ground' | 'air') => void;
  setCloudType: (t: 'gas' | 'dust') => void;
  setActiveTab: (tab: 'chart' | 'table' | 'map') => void;
  setEpicenter: (coords: [number, number]) => void;
  runCalculation: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  selectedSubstance: SUBSTANCES.find(s => s.id === 'propane')!,
  mass: 1000,
  congestion: 3,
  position: 'ground',
  cloudType: 'gas',
  result: null,
  isCalculating: false,
  activeTab: 'chart',
  epicenter: [54.7388, 55.9721], // Уфа по умолчанию

  setSubstance: (s) => set({ selectedSubstance: s }),
  setMass: (m) => set({ mass: m }),
  setCongestion: (c) => set({ congestion: c }),
  setPosition: (p) => set({ position: p }),
  setCloudType: (t) => set({ cloudType: t }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setEpicenter: (coords) => set({ epicenter: coords }),

  runCalculation: () => {
    const { selectedSubstance, mass, congestion, position, cloudType } = get();
    set({ isCalculating: true });

    setTimeout(() => {
      const input: CalcInput = {
        substance: selectedSubstance,
        mass,
        congestion,
        position,
        cloudType,
      };
      const result = calculate(input);
      set({ result, isCalculating: false });
    }, 300);
  },
}));
