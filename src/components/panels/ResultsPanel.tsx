import { BarChart2, Table2, Map } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { PressureChart } from '../chart/PressureChart';
import { ZonesTable } from '../table/ZonesTable';
import { ZonesMap } from '../map/ZonesMap';

const TABS = [
  { id: 'chart' as const, label: 'График', icon: BarChart2 },
  { id: 'table' as const, label: 'Таблица зон', icon: Table2 },
  { id: 'map'   as const, label: 'Карта', icon: Map },
];

const MODE_COLORS: Record<number, string> = {
  1: 'text-red-400 bg-red-400/10',
  2: 'text-orange-400 bg-orange-400/10',
  3: 'text-orange-300 bg-orange-300/10',
  4: 'text-yellow-400 bg-yellow-400/10',
  5: 'text-yellow-300 bg-yellow-300/10',
  6: 'text-green-400 bg-green-400/10',
};

export function ResultsPanel() {
  const { result, activeTab, setActiveTab } = useStore();

  if (!result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center">
          <BarChart2 className="w-9 h-9 text-slate-600" />
        </div>
        <div>
          <p className="text-slate-400 font-medium" style={{ fontSize: 16 }}>
            Введите параметры и нажмите «Рассчитать»
          </p>
          <p className="text-slate-600 mt-1" style={{ fontSize: 14 }}>
            Результаты отобразятся здесь
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Мини-сводка */}
      <div className="flex items-center gap-5 px-6 py-3 border-b border-slate-800 bg-slate-900/20 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500" style={{ fontSize: 13 }}>Вещество:</span>
          <span className="font-medium text-slate-200" style={{ fontSize: 13 }}>{result.input.substance.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500" style={{ fontSize: 13 }}>Масса:</span>
          <span className="font-medium text-slate-200" style={{ fontSize: 13 }}>{result.input.mass.toLocaleString('ru')} кг</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500" style={{ fontSize: 13 }}>E:</span>
          <span className="font-medium text-slate-200" style={{ fontSize: 13 }}>{(result.E / 1e9).toFixed(2)} ГДж</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500" style={{ fontSize: 13 }}>Режим:</span>
          <span className={`font-semibold px-2 py-0.5 rounded-md ${MODE_COLORS[result.mode]}`} style={{ fontSize: 13 }}>
            Режим {result.mode}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500" style={{ fontSize: 13 }}>u:</span>
          <span className="font-medium text-slate-200" style={{ fontSize: 13 }}>{result.flameSpeed.toFixed(0)} м/с</span>
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex items-center gap-1 px-6 pt-4 pb-0 border-b border-slate-800">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-t-lg border-b-2 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                  : 'border-transparent text-slate-500 hover:text-slate-400 hover:bg-slate-800/40'
              }`}
              style={{ fontSize: 14 }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Контент — все вкладки рендерятся сразу, скрываются через display */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className={`p-6 h-full ${activeTab === 'chart' ? 'flex flex-col' : 'hidden'}`}>
          <PressureChart result={result} />
        </div>
        <div className={`p-6 ${activeTab === 'table' ? 'block' : 'hidden'}`}>
          <ZonesTable result={result} />
        </div>
        <div className={`p-6 h-full ${activeTab === 'map' ? 'flex flex-col' : 'hidden'}`} style={{ minHeight: 500 }}>
          <ZonesMap result={result} isVisible={activeTab === 'map'} />
        </div>
      </div>
    </div>
  );
}
