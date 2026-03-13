import { useState } from 'react';
import { Search, Info, ChevronDown, Zap, Loader2, BookOpen } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { SUBSTANCES, SUBSTANCE_CLASS_LABELS, CONGESTION_LABELS } from '../../data/substances';
import type { Substance } from '../../types';
import { ReferenceModal } from '../modal/ReferenceModal';

const CLASS_COLORS: Record<number, string> = {
  1: 'text-red-400 bg-red-400/10 border-red-400/30',
  2: 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  3: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  4: 'text-green-400 bg-green-400/10 border-green-400/30',
};

const CONGESTION_ICONS: Record<number, string> = {
  1: '🏭', 2: '🔩', 3: '⚙️', 4: '🌾',
};

// Справочник σ — степень расширения продуктов сгорания
const SIGMA_REF = [
  { label: 'Газо-/паровоздушная смесь (при отсутствии данных)', value: 7 },
  { label: 'Пылевоздушная смесь (при отсутствии данных)', value: 4 },
  { label: 'Метан (CH₄) — воздух', value: 7.5 },
  { label: 'Пропан (C₃H₈) — воздух', value: 8.0 },
  { label: 'Бутан (C₄H₁₀) — воздух', value: 8.0 },
  { label: 'Этилен (C₂H₄) — воздух', value: 8.2 },
  { label: 'Водород (H₂) — воздух', value: 6.9 },
  { label: 'Ацетилен (C₂H₂) — воздух', value: 8.0 },
  { label: 'Угольная пыль — воздух', value: 4.0 },
  { label: 'Мучная (зерновая) пыль — воздух', value: 4.0 },
];

// Справочник коэффициента положения
const POSITION_REF = [
  { label: 'Облако на поверхности земли', value: 2, hint: 'E × 2' },
  { label: 'Облако в воздухе (открытое пространство)', value: 1, hint: 'E × 1' },
  { label: 'Примечание: при расположении на земле энергозапас удваивается из-за отражения волны', value: '—', hint: '' },
];

function NumInput({
  label, value, onChange, min, max, step = 1, unit, hint,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; unit?: string; hint?: string;
}) {
  return (
    <div>
      <label className="block font-medium text-slate-400 mb-1.5" style={{ fontSize: 13 }}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ fontSize: 14 }}
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 focus:border-blue-500 focus:outline-none text-slate-200 transition-colors"
        />
        {unit && <span className="text-slate-500 font-mono shrink-0" style={{ fontSize: 14 }}>{unit}</span>}
      </div>
      {hint && <p className="text-slate-600 mt-1" style={{ fontSize: 12 }}>{hint}</p>}
    </div>
  );
}

function RefTable({ title, rows }: { title: string; rows: { label: string; value: number | string; hint?: string }[] }) {
  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-800 flex items-center gap-1.5">
        <BookOpen className="w-3 h-3 text-slate-500" />
        <span className="text-slate-500 font-medium" style={{ fontSize: 11 }}>Справочник: {title}</span>
      </div>
      <div>
        {rows.map((row, i) => (
          <div key={i} className={`flex items-center justify-between px-3 py-2 ${i < rows.length - 1 ? 'border-b border-slate-800/60' : ''}`}>
            <span className="text-slate-500 leading-snug" style={{ fontSize: 12 }}>{row.label}</span>
            <div className="text-right shrink-0 ml-2">
              <span className="font-mono font-semibold text-slate-300" style={{ fontSize: 13 }}>{row.value}</span>
              {row.hint && <span className="text-slate-600 ml-1" style={{ fontSize: 11 }}>{row.hint}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InputPanel() {
  const {
    selectedSubstance, mass, congestion, sigma, positionMultiplier,
    isCalculating, result,
    setSubstance, setMass, setCongestion, setSigma, setPositionMultiplier,
    runCalculation,
  } = useStore();

  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRef, setShowRef] = useState(false);

  const filtered = SUBSTANCES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    (s.formula?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const grouped = [1, 2, 3, 4].map(cls => ({
    cls, label: SUBSTANCE_CLASS_LABELS[cls],
    items: filtered.filter(s => s.class === cls),
  })).filter(g => g.items.length > 0);

  const handleSelect = (s: Substance) => {
    setSubstance(s);
    setDropdownOpen(false);
    setSearch('');
  };

  return (
    <aside className="w-[300px] min-w-[280px] flex flex-col border-r border-slate-800 bg-slate-900/30 overflow-y-auto">
      <div className="px-5 pt-5 pb-4 border-b border-slate-800">
        <h2 className="font-semibold text-slate-200" style={{ fontSize: 16 }}>Исходные данные</h2>
        <p className="text-slate-500 mt-0.5" style={{ fontSize: 13 }}>Введите параметры для расчёта</p>
      </div>

      <div className="flex flex-col gap-5 p-5">

        {/* Горючее вещество */}
        <div>
          <label className="block font-medium text-slate-400 mb-1.5" style={{ fontSize: 13 }}>Горючее вещество</label>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-colors text-left"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`shrink-0 px-1.5 py-0.5 rounded border font-mono ${CLASS_COLORS[selectedSubstance.class]}`} style={{ fontSize: 12 }}>
                  К{selectedSubstance.class}
                </span>
                <span className="text-slate-200 truncate" style={{ fontSize: 14 }}>{selectedSubstance.name}</span>
                {selectedSubstance.formula && (
                  <span className="text-slate-500 font-mono shrink-0" style={{ fontSize: 12 }}>{selectedSubstance.formula}</span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 w-full mt-1 rounded-lg border border-slate-700 bg-slate-900 shadow-2xl">
                <div className="p-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-slate-800">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Поиск вещества..." style={{ fontSize: 13 }}
                      className="bg-transparent text-slate-200 placeholder-slate-600 outline-none w-full" />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {grouped.map(group => (
                    <div key={group.cls}>
                      <div className="px-3 py-1.5 text-slate-600 font-medium sticky top-0 bg-slate-900" style={{ fontSize: 12 }}>
                        {group.label}
                      </div>
                      {group.items.map(s => (
                        <button key={s.id} onClick={() => handleSelect(s)}
                          className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 transition-colors text-left ${s.id === selectedSubstance.id ? 'bg-blue-600/10' : ''}`}>
                          <span className={`shrink-0 px-1.5 py-0.5 rounded border font-mono ${CLASS_COLORS[s.class]}`} style={{ fontSize: 11 }}>К{s.class}</span>
                          <span className="text-slate-300" style={{ fontSize: 13 }}>{s.name}</span>
                          {s.formula && <span className="text-slate-600 font-mono ml-auto shrink-0" style={{ fontSize: 12 }}>{s.formula}</span>}
                        </button>
                      ))}
                    </div>
                  ))}
                  {grouped.length === 0 && <p className="px-3 py-4 text-slate-600 text-center" style={{ fontSize: 13 }}>Ничего не найдено</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Масса вещества в газообразном состоянии */}
        <NumInput
          label="Масса вещества в газообразном состоянии MT"
          value={mass} onChange={setMass}
          min={1} max={1000000} unit="кг"
          hint="Масса вещества в облаке (от 1 до 1 000 000 кг)"
        />

        {/* Степень расширения σ */}
        <div>
          <NumInput
            label="Степень расширения продуктов сгорания σ"
            value={sigma} onChange={setSigma}
            min={1} max={20} step={0.5} unit=""
          />
          <div className="mt-2">
            <RefTable title="Типовые значения σ" rows={SIGMA_REF.map(r => ({ label: r.label, value: r.value }))} />
          </div>
        </div>

        {/* Коэффициент положения облака */}
        <div>
          <NumInput
            label="Коэффициент положения облака"
            value={positionMultiplier} onChange={setPositionMultiplier}
            min={1} max={2} step={1} unit=""
            hint="Влияет на эффективный энергозапас: E = MT · EУД · k"
          />
          <div className="mt-2">
            <RefTable title="Положение облака" rows={POSITION_REF.map(r => ({ label: r.label, value: r.value, hint: r.hint }))} />
          </div>
        </div>

        {/* Класс загроможденности */}
        <div>
          <label className="block font-medium text-slate-400 mb-2" style={{ fontSize: 13 }}>
            Класс загроможденности пространства
          </label>
          <div className="flex flex-col gap-2">
            {([1, 2, 3, 4] as const).map(cls => (
              <button key={cls} onClick={() => setCongestion(cls)}
                className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                  congestion === cls
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-700 bg-slate-800/40 hover:border-slate-600'
                }`}>
                <span className="text-xl leading-none mt-0.5">{CONGESTION_ICONS[cls]}</span>
                <div>
                  <div className={`font-medium ${congestion === cls ? 'text-blue-400' : 'text-slate-300'}`} style={{ fontSize: 13 }}>
                    {CONGESTION_LABELS[cls].short}
                  </div>
                  <div className="text-slate-600 mt-0.5 leading-relaxed" style={{ fontSize: 12 }}>
                    {CONGESTION_LABELS[cls].full}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="sticky bottom-0 p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm mt-auto flex flex-col gap-2">
        <button onClick={runCalculation} disabled={isCalculating || mass <= 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-white transition-all active:scale-95"
          style={{ fontSize: 15 }}>
          {isCalculating
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Вычисление...</>
            : <><Zap className="w-4 h-4" /> Рассчитать</>}
        </button>
        {result && (
          <button onClick={() => setShowRef(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-300 transition-all"
            style={{ fontSize: 14 }}>
            <Info className="w-4 h-4" />
            Принятые допущения
          </button>
        )}
      </div>

      {showRef && result && <ReferenceModal result={result} onClose={() => setShowRef(false)} />}
    </aside>
  );
}
