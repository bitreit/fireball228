export type SubstanceClass = 1 | 2 | 3 | 4;
export type CongestionClass = 1 | 2 | 3 | 4; // I, II, III, IV
export type CombustionMode = 1 | 2 | 3 | 4 | 5 | 6;
export type CloudPosition = 'ground' | 'air';

export interface Substance {
  id: string;
  name: string;
  nameEn: string;
  class: SubstanceClass;
  alpha: number;       // корректировочный параметр α
  EUD: number;         // удельная теплота сгорания, Дж/кг
  CNKPR?: number;      // НКПР, % об. (для справки)
  formula?: string;
}

export interface CalcInput {
  substance: Substance;
  mass: number;          // MТ, кг
  congestion: CongestionClass;
  position: CloudPosition;
  cloudType: 'gas' | 'dust'; // тип облака (газопаровоздушное или пылевоздушное)
}

export interface ZonePoint {
  distance: number;  // R, м
  pressure: number;  // ΔP, Па
  impulse: number;   // I+, Па·с
}

export interface DamageZone {
  label: string;
  description: string;
  thresholdKPa: number;  // нормируемое значение ΔP
  radius: number;        // радиус зоны, м
  area: number;          // площадь, м²
  color: string;
}

export interface CalcResult {
  input: CalcInput;
  E: number;                 // эффективный энергозапас, Дж
  mode: CombustionMode;      // режим сгорания
  flameSpeed: number;        // скорость фронта пламени, м/с
  sigma: number;             // степень расширения
  substanceClass: SubstanceClass;
  points: ZonePoint[];       // кривая ΔP(R)
  zones: DamageZone[];       // таблица зон
}
