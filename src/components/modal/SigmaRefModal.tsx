import { useState } from 'react';
import { X, BookOpen, Search } from 'lucide-react';
import { SUBSTANCES, SUBSTANCE_CLASS_LABELS } from '../../data/substances';

interface Props {
  onClose: () => void;
  onSelect: (sigma: number) => void;
}

const CLASS_COLORS: Record<number, { badge: string; row: string }> = {
  1: { badge: 'text-red-400 bg-red-400/10 border-red-400/30', row: 'hover:bg-red-400/5' },
  2: { badge: 'text-orange-400 bg-orange-400/10 border-orange-400/30', row: 'hover:bg-orange-400/5' },
  3: { badge: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', row: 'hover:bg-yellow-400/5' },
  4: { badge: 'text-green-400 bg-green-400/10 border-green-400/30', row: 'hover:bg-green-400/5' },
};

export function SigmaRefModal({ onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<number | null>(null);

  const substances = SUBSTANCES.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.formula?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchClass = filterClass === null || s.class === filterClass;
    return matchSearch && matchClass && s.sigma !== undefined;
  });

  const grouped = [1, 2, 3, 4].map(cls => ({
    cls,
    label: SUBSTANCE_CLASS_LABELS[cls],
    items: substances.filter(s => s.class === cls),
  })).filter(g => g.items.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col" style={{ maxHeight: '85vh' }}>

        {/* Шапка */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <div>
              <h3 className="font-semibold text-slate-200" style={{ fontSize: 15 }}>
                Справочник σ — степень расширения
              </h3>
              <p className="text-slate-500 mt-0.5" style={{ fontSize: 12 }}>
                Нажмите на строку чтобы подставить значение
              </p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Поиск + фильтр по классу */}
        <div className="px-5 py-3 border-b border-slate-800 shrink-0 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию или формуле..."
              style={{ fontSize: 13 }}
              className="bg-transparent text-slate-200 placeholder-slate-600 outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setFilterClass(null)}
              style={{ fontSize: 12 }}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${filterClass === null ? 'bg-slate-600 text-white' : 'text-slate-500 hover:text-slate-400'}`}>
              Все
            </button>
            {[1, 2, 3, 4].map(cls => (
              <button key={cls} onClick={() => setFilterClass(filterClass === cls ? null : cls)}
                style={{ fontSize: 12 }}
                className={`px-2.5 py-1.5 rounded-md font-medium border transition-all ${
                  filterClass === cls
                    ? CLASS_COLORS[cls].badge + ' opacity-100'
                    : 'border-transparent text-slate-500 hover:text-slate-400'
                }`}>
                К{cls}
              </button>
            ))}
          </div>
        </div>

        {/* Шапка таблицы */}
        <div className="grid px-5 py-2 border-b border-slate-800 shrink-0" style={{ gridTemplateColumns: '2fr 1fr 1fr 80px' }}>
          <span className="text-slate-600 uppercase font-semibold" style={{ fontSize: 11 }}>Вещество</span>
          <span className="text-slate-600 uppercase font-semibold" style={{ fontSize: 11 }}>Формула</span>
          <span className="text-slate-600 uppercase font-semibold" style={{ fontSize: 11 }}>Класс</span>
          <span className="text-slate-600 uppercase font-semibold text-right" style={{ fontSize: 11 }}>σ</span>
        </div>

        {/* Строки */}
        <div className="overflow-y-auto flex-1">
          {grouped.map(group => (
            <div key={group.cls}>
              <div className="px-5 py-2 bg-slate-800/40 border-b border-t border-slate-800/60 sticky top-0">
                <span className="text-slate-500 font-medium" style={{ fontSize: 12 }}>{group.label}</span>
              </div>
              {group.items.map(s => (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s.sigma!); onClose(); }}
                  className={`w-full grid px-5 py-2.5 border-b border-slate-800/40 transition-colors text-left ${CLASS_COLORS[s.class].row}`}
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 80px' }}
                >
                  <span className="text-slate-300 truncate pr-2" style={{ fontSize: 13 }}>{s.name}</span>
                  <span className="text-slate-500 font-mono" style={{ fontSize: 12 }}>{s.formula ?? '—'}</span>
                  <span>
                    <span className={`px-1.5 py-0.5 rounded border font-mono ${CLASS_COLORS[s.class].badge}`} style={{ fontSize: 11 }}>
                      К{s.class}
                    </span>
                  </span>
                  <span className="text-right font-mono font-bold text-blue-400" style={{ fontSize: 14 }}>{s.sigma}</span>
                </button>
              ))}
            </div>
          ))}

          {grouped.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-600">
              <Search className="w-8 h-8 mb-3 opacity-50" />
              <p style={{ fontSize: 14 }}>Ничего не найдено</p>
            </div>
          )}
        </div>

        {/* Подвал — общие значения */}
        <div className="px-5 py-3 border-t border-slate-800 shrink-0 bg-slate-900/50">
          <p className="text-slate-600 mb-2" style={{ fontSize: 12 }}>Рекомендуемые значения при отсутствии данных (п. 27 Приказа МЧС 533):</p>
          <div className="flex gap-4">
            <button onClick={() => { onSelect(7); onClose(); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
              <span className="font-mono font-bold text-blue-400" style={{ fontSize: 15 }}>7</span>
              <span className="text-slate-400" style={{ fontSize: 12 }}>Газо-/паровоздушная смесь</span>
            </button>
            <button onClick={() => { onSelect(4); onClose(); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors">
              <span className="font-mono font-bold text-blue-400" style={{ fontSize: 15 }}>4</span>
              <span className="text-slate-400" style={{ fontSize: 12 }}>Пылевоздушная смесь</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
