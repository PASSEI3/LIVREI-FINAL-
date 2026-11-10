import { useState, useEffect } from 'react';
import { X, Zap, MapPin, Navigation, Radar } from 'lucide-react';
import type { BookListing } from '@/types';
import { BookCover } from '@/components/BookCover/BookCover';

interface Props {
  listings: BookListing[];
  userCity: string;
  onClose: () => void;
  onOpenDetail: (listing: BookListing) => void;
}

const conditionColor: Record<string, string> = {
  'Novo/Lacrado': 'bg-mint-400 text-purple-950',
  'Seminovo': 'bg-mint-300 text-purple-950',
  'Bom Estado': 'bg-purple-300 text-purple-900',
  'Marcas de Uso': 'bg-purple-200 text-purple-900',
};

export function RadarScreen({ listings, userCity, onClose, onOpenDetail }: Props) {
  const [scanning, setScanning] = useState(true);
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setScanning(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!scanning) return;
    let raf: number;
    const tick = () => {
      setSweepAngle((a) => (a + 4) % 360);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scanning]);

  const nearby = listings
    .filter((l) => l.distanceKm < 5)
    .sort((a, b) => a.distanceKm - b.distanceKm);
  const count = nearby.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-9950 bg-purple-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900 text-purple-200 active:scale-90" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
        <h2 className="flex items-center gap-2 text-sm font-bold text-purple-50">
          <Radar className="h-4 w-4 text-mint-400" /> Radar LIVREI
        </h2>
        <div className="h-9 w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar">
        {/* Radar visual */}
        <div className="relative mx-auto mb-6 mt-2 flex h-56 w-56 items-center justify-center">
          {/* Rings */}
          <div className="absolute inset-0 rounded-full border-2 border-mint-400/20" />
          <div className="absolute inset-6 rounded-full border-2 border-mint-400/15" />
          <div className="absolute inset-12 rounded-full border-2 border-mint-400/10" />
          <div className="absolute inset-[4.5rem] rounded-full border-2 border-mint-400/10" />

          {/* Cross lines */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-mint-400/10" />
          <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-mint-400/10" />

          {/* Sweep */}
          {scanning && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from ${sweepAngle}deg, transparent 0deg, rgba(16,185,129,0.35) 60deg, transparent 90deg)`,
              }}
            />
          )}

          {/* Center dot */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint-400 text-purple-950 shadow-[0_0_20px_4px] shadow-mint-400/50">
              <Navigation className="h-6 w-6" />
            </div>
            <span className="mt-1.5 text-[9px] font-bold text-mint-400">VOCÊ</span>
          </div>

          {/* Blips — livros próximos */}
          {!scanning &&
            nearby.slice(0, 6).map((l, i) => {
              const angle = (i / Math.min(nearby.length, 6)) * Math.PI * 2 - Math.PI / 2;
              const radius = 40 + (l.distanceKm / 5) * 50;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              return (
                <div
                  key={l.id}
                  className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 text-sm ring-2 ring-mint-400/60 animate-scale-in"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  {l.book.coverEmoji}
                </div>
              );
            })}
        </div>

        {/* Contador regional */}
        {scanning ? (
          <div className="flex flex-col items-center">
            <p className="animate-pulse text-sm font-semibold text-mint-400">Escaneando sua região...</p>
            <p className="mt-1 text-xs text-purple-400">{userCity}</p>
          </div>
        ) : (
          <>
            <div className="mb-5 rounded-3xl bg-gradient-to-br from-purple-800 to-purple-950 p-4 text-center ring-1 ring-mint-400/40">
              <p className="text-sm leading-relaxed text-purple-200">
                Existem{' '}
                <span className="text-2xl font-extrabold text-mint-400">{count}</span>{' '}
                livros disponíveis para troca em mãos a menos de{' '}
                <span className="font-bold text-mint-400">5 km</span> de você!
              </p>
              <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-purple-400">
                <MapPin className="h-3 w-3" /> {userCity}
              </p>
            </div>

            {/* Lista horizontal de proximidade */}
            <div className="mb-2 flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-mint-400" />
              <p className="text-xs font-semibold text-purple-300">Mais próximos de você</p>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {nearby.map((l) => (
                <button
                  key={l.id}
                  onClick={() => onOpenDetail(l)}
                  className="flex w-28 shrink-0 flex-col active:scale-[0.97]"
                >
                  <div className="relative">
                    <BookCover book={l.book} className="aspect-[3/4] w-full" emojiSize="text-2xl" />
                    <div className="absolute right-1 top-1 rounded-full bg-mint-400 px-1.5 py-0.5 text-[9px] font-bold text-purple-950">
                      {l.distanceKm} km
                    </div>
                  </div>
                  <p className="mt-1.5 truncate text-[11px] font-semibold text-purple-100">{l.book.title}</p>
                  <p className="truncate text-[10px] text-purple-400">{l.book.author}</p>
                  <span className={`mt-1 inline-block w-fit rounded-full px-2 py-0.5 text-[9px] font-semibold ${conditionColor[l.book.condition]}`}>
                    {l.book.condition}
                  </span>
                </button>
              ))}
            </div>

            {count === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="mb-3 text-4xl">📡</div>
                <p className="text-sm text-purple-300">Nenhum livro a menos de 5 km no momento.</p>
                <p className="mt-1 text-xs text-purple-400">Tente novamente mais tarde!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
