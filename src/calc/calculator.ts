import type {
  CalcInput, CalcResult, CombustionMode,
  DamageZone, ZonePoint,
} from '../types';

const P0 = 101325;
const C0 = 340;

const COMBUSTION_MODE_TABLE: Record<number, Record<number, CombustionMode>> = {
  1: { 1: 1, 2: 1, 3: 2, 4: 3 },
  2: { 1: 1, 2: 2, 3: 3, 4: 4 },
  3: { 1: 2, 2: 3, 3: 4, 4: 5 },
  4: { 1: 3, 2: 4, 3: 5, 4: 6 },
};

const DAMAGE_THRESHOLDS: Omit<DamageZone, 'radius' | 'area'>[] = [
  { label: 'Зона 1', description: 'Полное разрушение зданий',          thresholdKPa: 100, color: '#dc2626' },
  { label: 'Зона 2', description: 'Тяжёлые повреждения конструкций',   thresholdKPa: 53,  color: '#ea580c' },
  { label: 'Зона 3', description: 'Средние повреждения зданий',        thresholdKPa: 28,  color: '#d97706' },
  { label: 'Зона 4', description: 'Лёгкие повреждения, травмы людей',  thresholdKPa: 12,  color: '#ca8a04' },
  { label: 'Зона 5', description: 'Разбитие стёкол, лёгкие контузии', thresholdKPa: 5,   color: '#65a30d' },
];

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

// П3.40 — безразмерное давление, детонация
function Px_detonation(Rx: number): number {
  const lnRx = Math.log(Rx);
  return Math.exp(
    -0.9278 - 1.5415 * lnRx + 0.1953 * lnRx ** 2 - 0.4818 * lnRx ** 3
  );
}

// П3.41 — безразмерный импульс, детонация
function Ix_detonation(Rx: number): number {
  const lnRx = Math.log(Rx);
  return Math.exp(
    -2.7188 - 1.4572 * lnRx + 0.0966 * lnRx ** 2 - 0.0462 * lnRx ** 3
  );
}

// Максимальное избыточное давление вблизи источника дефлаграции
// на основе соотношений Ренкина-Гюгонио (скачок уплотнения, ведомый поршнем)
function Px1_max(u: number, sigma: number): number {
  const vp = (sigma - 1) / sigma * u;   // скорость газа за фронтом, м/с
  const gamma = sigma;
  const k = 2 * C0 / (gamma + 1);
  const b = vp / k;
  // Ms² - b·Ms - 1 = 0
  const Ms = (b + Math.sqrt(b * b + 4)) / 2;
  return Math.max(0, 2 * gamma * Ms * Ms / (gamma + 1) - (gamma - 1) / (gamma + 1));
}

// П3.44 — давление дефлаграции с физически обоснованным ближним полем
function Px_deflagration(Rx: number, sigma: number, u: number): number {
  const Ruse = Math.max(Rx, 0.34); // Rкр1 = 0.34
  const Pmax = Px1_max(u, sigma);
  const Rx0 = 0.4; // характерный масштаб затухания
  return Pmax / Math.pow(1 + Ruse / Rx0, 2);
}

// П3.45-46 — импульс дефлаграции
function Ix_deflagration(Rx: number, sigma: number, u: number): number {
  const Ruse = Math.max(Rx, 0.34);
  const Mach = u / C0;
  const A = (sigma - 1) / sigma * Mach;
  return 0.5 * A / (1 + Ruse);
}

function calcAtDistance(
  R: number, E: number, mode: CombustionMode,
  flameSpeed: number, sigma: number,
): ZonePoint {
  const Rx = R / Math.pow(E / P0, 1 / 3);

  let Px: number, Ix: number;

  if (mode === 1) {
    // Детонация (П3.39-П3.43)
    if (Rx < 0.2) {
      Px = 18.6; Ix = 0.53;
    } else if (Rx > 50) {
      const Px50 = Px_detonation(50);
      Px = Px50 * Math.pow(50 / Rx, 3);
      Ix = Ix_detonation(50) * Math.pow(50 / Rx, 2);
    } else {
      Px = Px_detonation(Rx);
      Ix = Ix_detonation(Rx);
    }
  } else {
    // Дефлаграция: Px = min(Px1, Px2)
    const Px1 = Px_deflagration(Rx, sigma, flameSpeed);
    const Ix1 = Ix_deflagration(Rx, sigma, flameSpeed);

    let Px2: number, Ix2: number;
    if (Rx < 0.2) {
      Px2 = 18.6; Ix2 = 0.53;
    } else if (Rx > 50) {
      Px2 = Px_detonation(50) * Math.pow(50 / Rx, 3);
      Ix2 = Ix_detonation(50) * Math.pow(50 / Rx, 2);
    } else {
      Px2 = Px_detonation(Rx);
      Ix2 = Ix_detonation(Rx);
    }

    Px = Math.min(Px1, Px2);
    Ix = Math.min(Ix1, Ix2);
  }

  return {
    distance: R,
    pressure: Px * P0,
    impulse: Ix * Math.pow(P0, 2 / 3) * Math.pow(E, 1 / 3) / C0,
  };
}

function findRadius(
  targetPa: number, E: number, mode: CombustionMode,
  flameSpeed: number, sigma: number,
): number {
  const pMax = calcAtDistance(0.5, E, mode, flameSpeed, sigma).pressure;
  if (pMax < targetPa) return 0;

  let lo = 0.5, hi = 30000;
  const pAt = (r: number) => calcAtDistance(r, E, mode, flameSpeed, sigma).pressure;
  if (pAt(hi) > targetPa) return hi;

  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    pAt(mid) > targetPa ? (lo = mid) : (hi = mid);
  }
  return (lo + hi) / 2;
}

function generatePoints(
  E: number, mode: CombustionMode, flameSpeed: number, sigma: number,
): ZonePoint[] {
  const points: ZonePoint[] = [];
  for (let i = 0; i <= 150; i++) {
    const R = Math.pow(10, Math.log10(1) + (i / 150) * (Math.log10(10000) - Math.log10(1)));
    const pt = calcAtDistance(R, E, mode, flameSpeed, sigma);
    if (pt.pressure > 1 && pt.impulse > 0.001) points.push(pt);
  }
  return points;
}

export function calculate(input: CalcInput): CalcResult {
  const { substance, mass, congestion, sigma, positionMultiplier } = input;

  let E = mass * substance.EUD;
  E *= positionMultiplier; // 2 для земли, 1 для воздуха

  const mode = COMBUSTION_MODE_TABLE[substance.class][congestion] as CombustionMode;
  const flameSpeed = getFlameSpeed(mode, mass);

  const points = generatePoints(E, mode, flameSpeed, sigma);

  const zones: DamageZone[] = DAMAGE_THRESHOLDS.map(thresh => {
    const targetPa = thresh.thresholdKPa * 1000;
    const radius = findRadius(targetPa, E, mode, flameSpeed, sigma);
    return {
      ...thresh,
      radius: radius > 0 ? Math.round(radius) : 0,
      area: radius > 0 ? Math.round(Math.PI * radius ** 2) : 0,
    };
  });

  return { input, E, mode, flameSpeed, sigma, substanceClass: substance.class, points, zones };
}
