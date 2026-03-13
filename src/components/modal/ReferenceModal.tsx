import { X, BookOpen } from 'lucide-react';
import type { CalcResult } from '../../types';
import { SUBSTANCE_CLASS_LABELS, CONGESTION_LABELS } from '../../data/substances';

interface Props { result: CalcResult; onClose: () => void }

const MODE_DESCRIPTIONS: Record<number, string> = {
  1: 'Детонация / горение ≥ 500 м/с',
  2: 'Дефлаграция 300–500 м/с',
  3: 'Дефлаграция 200–300 м/с',
  4: 'Дефлаграция 150–200 м/с',
  5: 'Дефлаграция u = 43 · M^(1/6) м/с',
  6: 'Дефлаграция u = 26 · M^(1/6) м/с',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-slate-800">
      <span className="text-xs text-slate-500 max-w-[55%]">{label}</span>
      <span className="text-xs text-slate-200 text-right font-mono">{value}</span>
    </div>
  );
}

export function ReferenceModal({ result, onClose }: Props) {
  const { input, E, mode, flameSpeed, sigma, substanceClass } = result;
  const { substance, mass, congestion, position, cloudType } = input;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-200">Принятые допущения и параметры</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Исходные данные</p>
            <Row label="Горючее вещество" value={substance.name} />
            <Row label="Класс чувствительности" value={`Класс ${substanceClass} — ${SUBSTANCE_CLASS_LABELS[substanceClass].split(' — ')[1]}`} />
            <Row label="Корректировочный параметр α" value={substance.alpha.toString()} />
            <Row label="Удельная теплота сгорания E_уд" value={`${(substance.EUD / 1e6).toFixed(2)} МДж/кг`} />
            <Row label="Масса горючего вещества M_T" value={`${mass.toLocaleString('ru')} кг`} />
            <Row label="Тип смеси" value={cloudType === 'gas' ? 'Газо-/паровоздушная' : 'Пылевоздушная'} />
            <Row label="Положение облака" value={position === 'ground' ? 'На поверхности земли (E × 2)' : 'В воздухе'} />
            <Row label="Класс загроможденности" value={CONGESTION_LABELS[congestion].short} />
          </div>

          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Расчётные параметры</p>
            <Row label="Эффективный энергозапас E" value={`${(E / 1e9).toFixed(3)} ГДж`} />
            <Row label="Режим сгорания облака" value={`Режим ${mode} — ${MODE_DESCRIPTIONS[mode]}`} />
            <Row label="Скорость фронта пламени u" value={`${flameSpeed.toFixed(1)} м/с`} />
            <Row label="Степень расширения σ" value={sigma.toString()} />
            <Row label="Атмосферное давление P₀" value="101 325 Па" />
            <Row label="Скорость звука C₀" value="340 м/с" />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Источники</p>
            <div className="rounded-lg bg-slate-800/50 p-3 text-xs text-slate-500 leading-relaxed">
              Приказ МЧС России от 26.06.2024 № 533 «Об утверждении методики определения
              расчётных величин пожарного риска на производственных объектах».
              Зарегистрировано в Минюсте России 02.09.2024 № 79360. Глава VIII, п. 16–27.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
