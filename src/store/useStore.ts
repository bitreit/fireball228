import { create } from 'zustand';
import type { CalcInput, CalcResult, Substance } from '../types';
import { SUBSTANCES } from '../data/substances';
import { calculate } from '../calc/calculator';

interface AppStore {
  selectedSubstance: Substance;
  mass: number;
  congestion: 1 | 2 | 3 | 4;
  sigma: number;             // степень расширения
  positionMultiplier: number; // коэффициент положения облака

  result: CalcResult | null;
  isCalculating: boolean;
  activeTab: 'chart' | 'table' | 'map';
  epicenter: [number, number];

  setSubstance: (s: Substance) => void;
  setMass: (m: number) => void;
  setCongestion: (c: 1 | 2 | 3 | 4) => void;
  setSigma: (v: number) => void;
  setPositionMultiplier: (v: number) => void;
  setActiveTab: (tab: 'chart' | 'table' | 'map') => void;
  setEpicenter: (coords: [number, number]) => void;
  runCalculation: () => void;
}

export const useStore = create<AppStore>((set, get) => ({
  selectedSubstance: SUBSTANCES.find(s => s.id === 'propane')!,
  mass: 1000,
  congestion: 3,
  sigma: 7,
  positionMultiplier: 2,
  result: null,
  isCalculating: false,
  activeTab: 'chart',
  epicenter: [54.7388, 55.9721], // Уфа

  setSubstance: (s) => set({ selectedSubstance: s }),
  setMass: (m) => set({ mass: m }),
  setCongestion: (c) => set({ congestion: c }),
  setSigma: (v) => set({ sigma: v }),
  setPositionMultiplier: (v) => set({ positionMultiplier: v }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setEpicenter: (coords) => set({ epicenter: coords }),

  runCalculation: () => {
    const { selectedSubstance, mass, congestion, sigma, positionMultiplier } = get();
    set({ isCalculating: true });
    setTimeout(() => {
      const input: CalcInput = { substance: selectedSubstance, mass, congestion, sigma, positionMultiplier };
      const result = calculate(input);
      set({ result, isCalculating: false });
    }, 300);
  },
}));
