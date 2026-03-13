import { Flame, Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30">
          <Flame className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-white leading-none">
            Расчёт волны давления
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Приказ МЧС России № 533 от 26.06.2024 · Глава VIII
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Shield className="w-4 h-4" />
        <span>ГПО · Производственные объекты</span>
      </div>
    </header>
  );
}
