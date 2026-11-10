import { useEffect, useState } from 'react';
import { QrCode, ScanLine, Check, X, ArrowRight, MapPin, Clock, ShieldCheck, Camera } from 'lucide-react';
import type { MatchEntry, HandoffRole, MeetupPoint } from '@/types';
import { BookCover } from '@/components/BookCover/BookCover';

interface Props {
  match: MatchEntry;
  role: HandoffRole;
  meetup: MeetupPoint;
  onClose: () => void;
  onConfirmed: () => void;
}

export function HandoffScreen({ match, role, meetup, onClose, onConfirmed }: Props) {
  const [scanning, setScanning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const isDelivering = role === 'entregando';

  // For the receiving side, simulate auto-detect after a moment of scanning.
  useEffect(() => {
    if (!scanning || isDelivering) return;
    const t = setTimeout(() => {
      setScanning(false);
      setConfirmed(true);
    }, 2600);
    return () => clearTimeout(t);
  }, [scanning, isDelivering]);

  const handleDone = () => {
    onConfirmed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-purple-950/80 backdrop-blur-sm">
      <div className="animate-slide-up flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-4xl bg-purple-900 no-scrollbar">
        <div className="sticky top-0 flex items-center justify-between border-b border-purple-800 bg-purple-900 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-purple-50">
              {isDelivering ? 'Entregar o livro' : 'Confirmar recebimento'}
            </h2>
            <p className="text-xs text-purple-400">Troca presencial validada</p>
          </div>
          <button onClick={onClose} className="text-purple-300 active:scale-90" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-purple-800/60 p-3">
            <BookCover book={isDelivering ? match.bookTo : match.bookFrom} className="h-20 w-14" emojiSize="text-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase text-mint-400">
                {isDelivering ? 'Você entrega' : 'Você recebe'}
              </p>
              <p className="truncate text-sm font-bold text-purple-50">
                {(isDelivering ? match.bookTo : match.bookFrom).title}
              </p>
              <p className="truncate text-xs text-purple-300">
                {(isDelivering ? match.bookTo : match.bookFrom).author}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-500" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 text-lg">
              {match.partnerEmoji}
            </div>
          </div>

          <div className="mb-4 rounded-2xl bg-purple-800/40 p-3">
            <p className="text-[10px] font-semibold uppercase text-purple-400">Ponto de encontro</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-purple-50">
              <span className="text-lg">{meetup.emoji}</span> {meetup.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-300">
              <MapPin className="h-3 w-3" /> {meetup.address}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-purple-400">
              <Clock className="h-3 w-3" /> {meetup.hours}
            </p>
          </div>

          {!confirmed ? (
            isDelivering ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 flex h-52 w-52 items-center justify-center rounded-3xl bg-white p-4">
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const seed = (i * 7 + match.id.charCodeAt(0) * 3) % 5;
                      return (
                        <div
                          key={i}
                          className={`h-3 w-3 rounded-[1px] ${seed < 2 ? 'bg-purple-950' : 'bg-white'}`}
                        />
                      );
                    })}
                  </div>
                  <div className="absolute inset-3 rounded-2xl border-2 border-purple-950/10" />
                  <span className="absolute bottom-2 right-2 text-xs">🟣</span>
                </div>
                <p className="text-center text-sm text-purple-200">
                  Mostre este QR Code para <span className="font-bold text-mint-400">{match.partnerName}</span> escanear no encontro.
                </p>
                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-mint-400/10 px-4 py-2.5">
                  <ShieldCheck className="h-4 w-4 text-mint-400" />
                  <p className="text-xs text-mint-200">
                    Código de uso único. Válido apenas no local do encontro.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative mb-4 flex h-60 w-60 items-center justify-center overflow-hidden rounded-3xl border-2 border-purple-600 bg-purple-950">
                  {/* simulated camera viewport */}
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-purple-950" />
                  <div className="absolute left-6 top-6 h-10 w-10 rounded-tl-2xl border-l-4 border-t-4 border-mint-400" />
                  <div className="absolute right-6 top-6 h-10 w-10 rounded-tr-2xl border-r-4 border-t-4 border-mint-400" />
                  <div className="absolute left-6 bottom-6 h-10 w-10 rounded-bl-2xl border-l-4 border-b-4 border-mint-400" />
                  <div className="absolute right-6 bottom-6 h-10 w-10 rounded-br-2xl border-r-4 border-b-4 border-mint-400" />
                  {scanning ? (
                    <div className="absolute inset-x-8 top-8 h-1 bg-mint-400 shadow-[0_0_12px_2px] shadow-mint-400 animate-[scanline_1.6s_ease-in-out_infinite]" />
                  ) : (
                    <Camera className="h-12 w-12 text-purple-500" />
                  )}
                  <span className="z-10 text-2xl">📷</span>
                </div>
                <p className="text-center text-sm text-purple-200">
                  {scanning
                    ? 'Escaneando o QR Code do entregador...'
                    : 'Aponte a câmera para o QR Code do livro.'}
                </p>
                {!scanning ? (
                  <button
                    onClick={() => setScanning(true)}
                    className="mt-4 flex items-center gap-2 rounded-full bg-mint-400 px-6 py-3 font-bold text-purple-950 active:scale-95"
                  >
                    <ScanLine className="h-5 w-5" /> Iniciar scanner
                  </button>
                ) : (
                  <p className="mt-4 animate-pulse text-mint-400 font-semibold">Aguardando leitura...</p>
                )}
                <style>{`
                  @keyframes scanline {
                    0% { top: 8px; }
                    50% { top: calc(100% - 12px); }
                    100% { top: 8px; }
                  }
                `}</style>
              </div>
            )
          ) : (
            <div className="animate-scale-in flex flex-col items-center py-6 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mint-400">
                <Check className="h-10 w-10 text-purple-950" />
              </div>
              <h3 className="text-lg font-bold text-purple-50">Entrega confirmada!</h3>
              <p className="mt-1 text-sm text-purple-300">
                A troca com {match.partnerName} foi validada presencialmente.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-mint-400/10 px-4 py-2 text-xs text-mint-200">
                <ShieldCheck className="h-4 w-4" /> Registro de troca salvo com segurança
              </div>
              <button
                onClick={handleDone}
                className="mt-6 w-full rounded-full bg-mint-400 py-3.5 font-bold text-purple-950 active:scale-95"
              >
                Concluir troca
              </button>
            </div>
          )}

          {!confirmed && isDelivering && (
            <button
              onClick={() => setConfirmed(true)}
              className="mt-5 w-full rounded-full border border-purple-700 py-3 text-sm font-semibold text-purple-300 active:scale-95"
            >
              Simular confirmação do recebedor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
