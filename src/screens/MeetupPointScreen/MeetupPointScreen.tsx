import { useState } from 'react';
import { MapPin, Clock, Check, X, Navigation, ShieldCheck } from 'lucide-react';
import type { MeetupPoint } from '@/types';

interface Props {
  points: MeetupPoint[];
  city: string;
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

export function MeetupPointScreen({ points, city, onSelect, onClose }: Props) {
  const [selected, setSelected] = useState<MeetupPoint | null>(null);
  const cityPoints = points.filter((p) => p.city === city);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-purple-950/80 backdrop-blur-sm">
      <div className="animate-slide-up flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-4xl bg-purple-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-purple-800 bg-purple-900 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-purple-50">Pontos de Encontro Oficiais</h2>
            <p className="text-xs text-purple-400">{city}</p>
          </div>
          <button onClick={onClose} className="text-purple-300 active:scale-90" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-mint-400/10 px-5 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-mint-400" />
          <p className="text-xs text-mint-200">
            Locais verificados e monitorados para sua segurança.
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-5 no-scrollbar">
          {cityPoints.map((p) => {
            const isSel = selected?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`flex w-full items-start gap-3 rounded-3xl p-4 text-left ring-1 transition active:scale-[0.98] ${
                  isSel ? 'bg-mint-400/15 ring-mint-400' : 'bg-purple-800/50 ring-purple-700'
                }`}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-950 text-2xl">
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColor[p.type]}`}>
                      {p.type}
                    </span>
                    {isSel && <Check className="h-4 w-4 text-mint-400" />}
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-purple-50">{p.name}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-300">
                    <MapPin className="h-3 w-3" /> {p.address}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-400">
                    <Clock className="h-3 w-3" /> {p.hours}
                  </p>
                </div>
              </button>
            );
          })}

          {cityPoints.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="mb-2 text-4xl">🗺️</div>
              <p className="text-sm text-purple-300">
                Sem pontos oficiais em {city}. Use o envio pelos Correios.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-purple-800 p-5">
          <button
            disabled={!selected}
            onClick={() => selected && onSelect(selected)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 font-bold text-purple-950 disabled:opacity-40 active:scale-95"
          >
            <Navigation className="h-5 w-5" />
            {selected ? `Confirmar: ${selected.name.split(' ')[0]}` : 'Selecione um ponto'}
          </button>
        </div>
      </div>
    </div>
  );
}
