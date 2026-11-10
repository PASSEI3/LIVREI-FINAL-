import { MapPin, Clock, Check, X, ShieldCheck, Search } from 'lucide-react';
import { useState } from 'react';
import type { MeetupPoint } from '@/types';

interface Props {
  points: MeetupPoint[];
  city: string;
  selected: MeetupPoint | null;
  onSelect: (point: MeetupPoint) => void;
  onClose: () => void;
}

const typeColor: Record<MeetupPoint['type'], string> = {
  Cafeteria: 'bg-mint-400/20 text-mint-300',
  Livraria: 'bg-purple-400/20 text-purple-300',
  Biblioteca: 'bg-purple-500/20 text-purple-200',
  Shopping: 'bg-mint-400/20 text-mint-300',
  'Metrô': 'bg-purple-400/20 text-purple-300',
  'Centro Cultural': 'bg-purple-500/20 text-purple-200',
};

export function MeetupPopupModal({ points, city, selected, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');
  const cityPoints = points.filter((p) => p.city === city);
  const filtered = query.trim()
    ? cityPoints.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.address.toLowerCase().includes(query.toLowerCase()) ||
          p.type.toLowerCase().includes(query.toLowerCase())
      )
    : cityPoints;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-purple-950/85 p-4 backdrop-blur-sm">
      <div className="animate-scale-in flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-4xl bg-purple-900 ring-1 ring-purple-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-purple-50">Pontos de Encontro Seguros</h2>
            <p className="truncate text-xs text-purple-400">{city}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-800 text-purple-300 active:scale-90"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Segurança banner */}
        <div className="flex items-center gap-2 bg-mint-400/10 px-5 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-mint-400" />
          <p className="text-xs text-mint-200">Locais verificados e monitorados para sua segurança.</p>
        </div>

        {/* Busca */}
        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar local ou tipo..."
              className="w-full rounded-xl bg-purple-800 py-2.5 pl-9 pr-3 text-sm text-purple-50 placeholder:text-purple-400 outline-none ring-1 ring-purple-700 focus:ring-mint-400"
            />
          </div>
        </div>

        {/* Lista rolável */}
        <div className="flex-1 space-y-2.5 overflow-y-auto p-5 no-scrollbar">
          {filtered.map((p) => {
            const isSel = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className={`flex w-full items-start gap-3 rounded-2xl p-3.5 text-left ring-1 transition active:scale-[0.98] ${
                  isSel ? 'bg-mint-400/15 ring-mint-400' : 'bg-purple-800/50 ring-purple-700'
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-950 text-xl">
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColor[p.type]}`}>
                      {p.type}
                    </span>
                    {isSel && <Check className="h-4 w-4 text-mint-400" />}
                  </div>
                  <h3 className="mt-1 truncate text-sm font-bold text-purple-50">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-purple-300">
                    <MapPin className="h-3 w-3 shrink-0" /> {p.address}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-400">
                    <Clock className="h-3 w-3" /> {p.hours}
                  </p>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="mb-2 text-4xl">🗺️</div>
              <p className="text-sm text-purple-300">
                {query ? 'Nenhum local encontrado para sua busca.' : `Sem pontos em ${city}. Use o envio pelos Correios.`}
              </p>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="border-t border-purple-800 px-5 py-4">
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 font-bold text-purple-950 disabled:opacity-40 active:scale-95"
          >
            {selected ? `Confirmar local` : 'Selecione um ponto'}
          </button>
        </div>
      </div>
    </div>
  );
}
