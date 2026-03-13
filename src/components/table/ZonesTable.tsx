import { Download } from 'lucide-react';
import type { CalcResult } from '../../types';

interface Props { result: CalcResult }

export function ZonesTable({ result }: Props) {
  const { zones, input } = result;

  const exportCSV = () => {
    const rows = [
      ['Зона', 'Описание', 'ΔP, кПа', 'Радиус, м', 'Площадь, м²'],
      ...zones.map(z => [z.label, z.description, z.thresholdKPa, z.radius, z.area]),
    ];
    const csv = rows.map(r => r.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zones_${input.substance.id}_${input.mass}kg.csv`;
    a.click();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Зоны действия поражающих факторов</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Вещество: <span className="text-slate-300">{input.substance.name}</span> ·
            Масса: <span className="text-slate-300">{input.mass.toLocaleString('ru')} кг</span> ·
            Режим сгорания: <span className="text-slate-300">{result.mode}</span>
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 hover:border-slate-600 text-xs text-slate-400 hover:text-slate-300 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          Экспорт CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Зона</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Описание поражения</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">ΔP, кПа</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Радиус, м</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Площадь, м²</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Площадь, га</th>
            </tr>
          </thead>
          <tbody>
            {zones.map((zone, i) => (
              <tr
                key={zone.label}
                className={`border-b border-slate-800/50 transition-colors hover:bg-slate-800/30 ${i % 2 === 0 ? 'bg-slate-900/20' : ''}`}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
                    <span className="font-medium text-slate-300">{zone.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-slate-400">{zone.description}</td>
                <td className="px-4 py-3.5 text-right">
                  <span
                    className="inline-block px-2 py-0.5 rounded font-mono text-xs font-semibold"
                    style={{ color: zone.color, backgroundColor: zone.color + '15' }}
                  >
                    {zone.thresholdKPa}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-slate-300">
                  {zone.radius > 0 ? zone.radius.toLocaleString('ru') : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                  {zone.radius > 0 ? zone.area.toLocaleString('ru') : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                  {zone.radius > 0 ? (zone.area / 10000).toFixed(2) : <span className="text-slate-600">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Мини-карточки */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-2">
        {zones.map(zone => (
          <div
            key={zone.label}
            className="rounded-xl border p-4 text-center"
            style={{ borderColor: zone.color + '40', backgroundColor: zone.color + '08' }}
          >
            <div className="text-2xl font-bold font-mono" style={{ color: zone.color }}>
              {zone.radius > 0 ? `${zone.radius} м` : '—'}
            </div>
            <div className="text-xs text-slate-500 mt-1">{zone.thresholdKPa} кПа</div>
            <div className="text-xs text-slate-600 mt-0.5 leading-tight">{zone.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
