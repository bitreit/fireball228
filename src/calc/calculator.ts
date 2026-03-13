import type {
  CalcInput, CalcResult, CombustionMode,
  DamageZone, ZonePoint,
} from '../types';

// Физические константы
const P0 = 101325;   // Па — атмосферное давление
const C0 = 340;      // м/с — скорость звука

// Таблица П3.3: режим сгорания = f(класс вещества, класс загроможденности)
const COMBUSTION_MODE_TABLE: Record<number, Record<number, CombustionMode>> = {
  1: { 1: 1, 2: 1, 3: 2, 4: 3 },
  2: { 1: 1, 2: 2, 3: 3, 4: 4 },
  3: { 1: 2, 2: 3, 3: 4, 4: 5 },
  4: { 1: 3, 2: 4, 3: 5, 4: 6 },
};

// Нормируемые значения ΔP
const DAMAGE_THRESHOLDS: Omit<DamageZone, 'radius' | 'area'>[] = [
  { label: 'Зона 1', description: 'Полное разрушение зданий',          thresholdKPa: 100, color: '#dc2626' },
  { label: 'Зона 2', description: 'Тяжёлые повреждения конструкций',   thresholdKPa: 53,  color: '#ea580c' },
  { label: 'Зона 3', description: 'Средние повреждения зданий',        thresholdKPa: 28,  color: '#d97706' },
  { label: 'Зона 4', description: 'Лёгкие повреждения, травмы людей',  thresholdKPa: 12,  color: '#ca8a04' },
  { label: 'Зона 5', description: 'Разбитие стёкол, лёгкие контузии', thresholdKPa: 5,   color: '#65a30d' },
];

// Скорость фронта пламени для режима
function getFlameSpeed(mode: CombustionMode, mass: number): number {
  switch (mode) {
    case 1: return 600;
    case 2: return 400;
    case 3: return 250;
    case 4: return 175;
    case 5: return 43 * Math.pow(mass, 1 / 6);
    case 6: return 26 * Math.pow(mass, 1 / 6);
    default: return 26 * Math.pow(mass, 1 / 6);
  }
}

// П3.40 — безразмерное давление для детонации
function Px_detonation(Rx: number): number {
  const lnRx = Math.log(Rx);
  const lnPx = -0.9278
    - 1.5415 * lnRx
    + 0.1953 * lnRx ** 2
    - 0.4818 * lnRx ** 3;
  return Math.exp(lnPx);
}

// П3.41 — безразмерный импульс для детонации
function Ix_detonation(Rx: number): number {
  const lnRx = Math.log(Rx);
  const lnIx = -2.7188
    - 1.4572 * lnRx
    + 0.0966 * lnRx ** 2
    - 0.0462 * lnRx ** 3;
  return Math.exp(lnIx);
}

// П3.44 — безразмерное давление для дефлаграции
function Px_deflagration(Rx: number, sigma: number, u: number): number {
  const Ruse = Math.max(Rx, 0.34); // Rкр1 = 0.34
  const Mach = u / C0;
  const A = (sigma - 1) / sigma * Mach;
  return A / (1 + A * Ruse);
}

// П3.45-46 — безразмерный импульс для дефлаграции
function Ix_deflagration(Rx: number, sigma: number, u: number): number {
  const Ruse = Math.max(Rx, 0.34);
  const Mach = u / C0;
  const A = (sigma - 1) / sigma * Mach;
  return 0.5 * A / (1 + Ruse);
}

// Расчёт ΔP и I+ для одного расстояния
function calcAtDistance(
  R: number,
  E: number,
  mode: CombustionMode,
  flameSpeed: number,
  sigma: number,
): ZonePoint {
  const Rx = R / Math.pow(E / P0, 1 / 3);

  let Px: number;
  let Ix: number;

  if (mode === 1) {
    // Детонация (П3.39-П3.43)
    if (Rx < 0.2) {
      Px = 18.6;
      Ix = 0.53;
    } else if (Rx > 50) {
      // За пределами применимости — экстраполяция
      const Px50 = Px_detonation(50);
      Px = Px50 * Math.pow(50 / Rx, 3);
      Ix = Ix_detonation(50) * Math.pow(50 / Rx, 2);
    } else {
      Px = Px_detonation(Rx);
      Ix = Ix_detonation(Rx);
    }
  } else {
    // Дефлаграция: Px = min(Px1_deflagration, Px2_detonation)
    const Px1 = Px_deflagration(Rx, sigma, flameSpeed);
    const Ix1 = Ix_deflagration(Rx, sigma, flameSpeed);

    // Детонационный предел
    let Px2: number;
    let Ix2: number;
    if (Rx < 0.2) {
      Px2 = 18.6; Ix2 = 0.53;
    } else if (Rx > 50) {
      const Px50 = Px_detonation(50);
      Px2 = Px50 * Math.pow(50 / Rx, 3);
      Ix2 = Ix_detonation(50) * Math.pow(50 / Rx, 2);
    } else {
      Px2 = Px_detonation(Rx);
      Ix2 = Ix_detonation(Rx);
    }

    Px = Math.min(Px1, Px2);
    Ix = Math.min(Ix1, Ix2);
  }

  // П3.42, П3.43 — размерные величины
  const deltaP = Px * P0;
  const impulse = Ix * Math.pow(P0, 2 / 3) * Math.pow(E, 1 / 3) / C0;

  return { distance: R, pressure: deltaP, impulse };
}

// Найти радиус зоны при заданном ΔP_target (бинарный поиск)
function findRadius(
  targetPa: number,
  E: number,
  mode: CombustionMode,
  flameSpeed: number,
  sigma: number,
): number {
  // Сначала проверяем максимальное давление (при минимальном расстоянии)
  const pMax = calcAtDistance(0.5, E, mode, flameSpeed, sigma).pressure;
  if (pMax < targetPa) return 0; // давление никогда не достигает target

  let lo = 0.5;
  let hi = 20000;

  const pAt = (r: number) => calcAtDistance(r, E, mode, flameSpeed, sigma).pressure;
  if (pAt(hi) > targetPa) return hi;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (pAt(mid) > targetPa) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// Генерация точек для графика (логарифмическая сетка 1–10000 м)
function generatePoints(
  E: number,
  mode: CombustionMode,
  flameSpeed: number,
  sigma: number,
): ZonePoint[] {
  const points: ZonePoint[] = [];
  const steps = 150;
  const logMin = Math.log10(1);
  const logMax = Math.log10(10000);

  for (let i = 0; i <= steps; i++) {
    const R = Math.pow(10, logMin + (i / steps) * (logMax - logMin));
    const pt = calcAtDistance(R, E, mode, flameSpeed, sigma);
    // Отсекаем бессмысленно малые значения
    if (pt.pressure > 1 && pt.impulse > 0.001) {
      points.push(pt);
    }
  }

  return points;
}

// Главная функция расчёта
export function calculate(input: CalcInput): CalcResult {
  const { substance, mass, congestion, position, cloudType } = input;

  // Эффективный энергозапас П3.36
  let E = mass * substance.EUD;
  if (position === 'ground') E *= 2;

  // Режим сгорания Таблица П3.3
  const mode = COMBUSTION_MODE_TABLE[substance.class][congestion] as CombustionMode;

  // Скорость фронта пламени
  const flameSpeed = getFlameSpeed(mode, mass);

  // Степень расширения σ
  const sigma = cloudType === 'dust' ? 4 : 7;

  // Генерируем точки кривой
  const points = generatePoints(E, mode, flameSpeed, sigma);

  // Таблица зон
  const zones: DamageZone[] = DAMAGE_THRESHOLDS.map(thresh => {
    const targetPa = thresh.thresholdKPa * 1000;
    const radius = findRadius(targetPa, E, mode, flameSpeed, sigma);
    const area = radius > 0 ? Math.PI * radius ** 2 : 0;
    return {
      ...thresh,
      radius: radius > 0 ? Math.round(radius) : 0,
      area: Math.round(area),
    };
  });

  return {
    input,
    E,
    mode,
    flameSpeed,
    sigma,
    substanceClass: substance.class,
    points,
    zones,
  };
}
