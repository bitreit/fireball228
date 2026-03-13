import { useState, useMemo, memo } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Label, Area,
} from 'recharts';
import type { CalcResult } from '../../types';

interface Props { result: CalcResult }

const ZONE_LINES = [
  { value: 100, label: '100 кПа', description: 'Полное разрушение', color: '#ef4444' },
  { value: 53,  label: '53 кПа',  description: 'Тяжёлые повреждения', color: '#f97316' },
  { value: 28,  label: '28 кПа',  description: 'Средние повреждения', color: '#f59e0b' },
  { value: 12,  label: '12 кПа',  description: 'Лёгкие повреждения', color: '#eab308' },
  { value: 5,   label: '5 кПа',   description: 'Разбитие стёкол', color: '#84cc16' },
];

const CustomTooltip = memo(function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 shadow-xl min-w-[170px]">
      <p style={{ fontSize: 13 }} className="text-slate-400 mb-2 font-medium">R = {Math.round(d.distance)} м</p>
      <p style={{ fontSize: 13 }} className="text-blue-400">ΔP = <span className="text-white font-semibold">{d.pressureKPa.toFixed(2)} кПа</span></p>
      <p style={{ fontSize: 13 }} className="text-cyan-400 mt-1">I⁺ = <span className="text-white font-semibold">{d.impulse.toFixed(1)} Па·с</span></p>
    </div>
  );
});

function niceMax(v: number): number {
  if (v <= 10)   return 10;
  if (v <= 20)   return 20;
  if (v <= 50)   return 50;
  if (v <= 100)  return 100;
  if (v <= 200)  return 200;
  if (v <= 500)  return 500;
  if (v <= 1000) return 1000;
  return Math.ceil(v / 1000) * 1000;
}

function formatDist(v: number) {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}км`;
  return `${Math.round(v)}м`;
}

export const PressureChart = memo(function PressureChart({ result }: Props) {
  const [metric, setMetric] = useState<'pressure' | 'impulse'>('pressure');
  const [scale, setScale] = useState<'linear' | 'log'>('linear');

  const data = useMemo(() => result.points
    .map(p => ({
      distance: Math.round(p.distance * 10) / 10,
      pressureKPa: p.pressure / 1000,
      impulse: p.impulse,
    }))
    .filter(p => p.pressureKPa > 0.01 && p.impulse > 0 && isFinite(p.pressureKPa) && isFinite(p.impulse)),
  [result]);

  const yMaxP = useMemo(() => niceMax(Math.max(...data.map(d => d.pressureKPa), 10)), [data]);
  const yMaxI = useMemo(() => niceMax(Math.max(...data.map(d => d.impulse), 10)), [data]);

  const yKey   = metric === 'pressure' ? 'pressureKPa' : 'impulse';
  const yLabel = metric === 'pressure' ? 'ΔP, кПа' : 'I⁺, Па·с';
  const lineColor = metric === 'pressure' ? '#60a5fa' : '#22d3ee';
  const areaColor = metric === 'pressure' ? '#3b82f6' : '#06b6d4';
  const yMax  = metric === 'pressure' ? yMaxP : yMaxI;
  const yDomain: [number, number] = scale === 'log' ? [0.01, yMax] : [0, yMax];

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500" style={{ fontSize: 15 }}>
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* Управление */}
      <div className="flex items-center justify-between flex-wrap gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13 }} className="text-slate-500">Параметр:</span>
          {([['pressure', 'Давление ΔP'], ['impulse', 'Импульс I⁺']] as const).map(([v, l]) => (
            <button key={v} onClick={() => setMetric(v)} style={{ fontSize: 13 }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${metric === v ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-300'}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 13 }} className="text-slate-500">Шкала:</span>
          {(['linear', 'log'] as const).map(v => (
            <button key={v} onClick={() => setScale(v)} style={{ fontSize: 13 }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${scale === v ? 'bg-slate-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-300'}`}>
              {v === 'log' ? 'Логарифм.' : 'Линейная'}
            </button>
          ))}
        </div>
      </div>

      {/* Легенда */}
      {metric === 'pressure' && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 shrink-0">
          {ZONE_LINES.map(z => (
            <div key={z.value} className="flex items-center gap-1.5">
              <div className="w-6 h-0 border-t-2 border-dashed" style={{ borderColor: z.color }} />
              <span style={{ fontSize: 12 }} className="text-slate-500">{z.label} — {z.description}</span>
            </div>
          ))}
        </div>
      )}

      {/* График */}
      {/* debounce=200 — задержка перерисовки при resize, width="99%" — фикс бага Recharts */}
      <div className="flex-1 min-h-0" style={{ minHeight: 280 }}>
        <ResponsiveContainer width="99%" height="100%" debounce={200}>
          <ComposedChart data={data} margin={{ top: 10, right: 30, bottom: 50, left: 35 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={areaColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={areaColor} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis dataKey="distance" type="number" scale="log" domain={['auto', 'auto']}
              tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={formatDist} tickCount={12}>
              <Label value="Расстояние от центра облака, м" offset={-18} position="insideBottom" fill="#64748b" fontSize={13} />
            </XAxis>

            <YAxis scale={scale} domain={yDomain} type="number" allowDataOverflow={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={v => v >= 100 ? `${Math.round(v)}` : v >= 1 ? v.toFixed(1) : v.toFixed(2)}
              width={55}>
              <Label value={yLabel} angle={-90} position="insideLeft" fill="#64748b" fontSize={13} offset={-15} />
            </YAxis>

            <Tooltip content={<CustomTooltip />} isAnimationActive={false} />

            {metric === 'pressure' && ZONE_LINES
              .filter(z => z.value <= yMax)
              .map(z => (
                <ReferenceLine key={z.value} y={z.value} stroke={z.color}
                  strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.85}
                  label={{ value: z.label, fill: z.color, fontSize: 11, position: 'insideTopRight', offset: 4 }}
                />
              ))}

            <Area type="monotone" dataKey={yKey} stroke="none"
              fill="url(#areaGrad)" isAnimationActive={false} animationDuration={0} />

            <Line type="monotone" dataKey={yKey} stroke={lineColor} strokeWidth={2.5}
              dot={false} activeDot={{ r: 5, fill: lineColor, stroke: '#0f172a', strokeWidth: 2 }}
              isAnimationActive={false} animationDuration={0} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});
