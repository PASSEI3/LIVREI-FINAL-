import { useState } from 'react';
import { Check, Shield, X, ArrowRight, Hourglass, MessageCircle, ArrowLeft } from 'lucide-react';
import type { MatchEntry } from '@/types';

interface Props {
  match: MatchEntry;
  pin: string;
  onChat: () => void;
  onClose: () => void;
}

const TRACK_STEPS = ['Pix Confirmado', 'Motoboy a Caminho', 'Em Trânsito', 'Entregue'] as const;

export function DeliveryTrackingScreen({ match, pin, onChat, onClose }: Props) {
  const [trackStep, setTrackStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-950">
      <div className="z-20 flex shrink-0 items-center justify-between border-b border-purple-800 bg-purple-900 px-5 py-4 shadow-lg shadow-purple-950/40">
        <h2 className="text-base font-bold text-purple-50">Acompanhamento de Entrega</h2>
        <button onClick={onClose} className="text-purple-300 active:scale-90" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="z-0 flex-1 overflow-y-auto p-5 no-scrollbar">
        {/* Barra de progresso vertical */}
        <div className="mb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-purple-400">Status do envio</p>
          <div className="space-y-0">
            {TRACK_STEPS.map((step, i) => (
              <div key={step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                      i < trackStep
                        ? 'bg-mint-400'
                        : i === trackStep
                          ? 'bg-mint-400 ring-4 ring-mint-400/30'
                          : 'bg-purple-800 ring-1 ring-purple-700'
                    }`}
                  >
                    {i < trackStep ? (
                      <Check className="h-4 w-4 text-purple-950" />
                    ) : i === trackStep ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-purple-950" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-purple-500" />
                    )}
                  </div>
                  {i < TRACK_STEPS.length - 1 && (
                    <div className={`mt-1 w-0.5 flex-1 ${i < trackStep ? 'bg-mint-400' : 'bg-purple-700'}`} />
                  )}
                </div>
                <div className={`pt-1.5 ${i < TRACK_STEPS.length - 1 ? 'pb-6' : 'pb-0'}`}>
                  <p className={`text-sm font-semibold ${i <= trackStep ? 'text-purple-50' : 'text-purple-400'}`}>{step}</p>
                  {i === trackStep && (
                    <p className="text-[11px] text-mint-300">
                      {trackStep === TRACK_STEPS.length - 1 ? 'Entrega concluída' : 'Status atual'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco de segurança — PIN */}
        <div className="mb-4 rounded-2xl bg-mint-400/15 p-4 ring-2 ring-mint-400">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-mint-400" />
            <p className="text-xs font-bold uppercase tracking-wide text-mint-300">Seu PIN de entrega</p>
          </div>
          <p className="mt-2 text-center font-mono text-4xl font-black tracking-[0.4em] text-mint-400">{pin}</p>
          <div className="mt-3 rounded-xl bg-amber-400/10 p-3 ring-1 ring-amber-400/40">
            <p className="text-[11px] leading-relaxed text-amber-200">
              🔒 SEGURANÇA: Só dite estes 4 dígitos para o motoboy APÓS abrir o pacote e conferir que o livro recebido está correto e em bom estado.
            </p>
          </div>
        </div>

        {/* Resumo dos livros */}
        <div className="mb-4 rounded-2xl bg-purple-800/60 p-3 ring-1 ring-purple-700">
          <p className="mb-2 text-[10px] font-semibold uppercase text-purple-400">Livros da troca</p>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-purple-50">{match.bookFrom.title}</p>
              <p className="truncate text-xs text-purple-300">{match.bookFrom.author}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-purple-500" />
            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-sm font-bold text-purple-50">{match.bookTo.title}</p>
              <p className="truncate text-xs text-purple-300">{match.bookTo.author}</p>
            </div>
          </div>
        </div>

        {/* Aviso de retenção em segurança */}
        <div className="mb-5 rounded-xl bg-purple-950/50 p-3 ring-1 ring-purple-800">
          <div className="flex items-start gap-2">
            <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" />
            <p className="text-[11px] leading-relaxed text-purple-200">
              O valor da troca fica retido em segurança pela plataforma até a digitação do PIN pelo motoboy. Só assim o pagamento é liberado ao outro leitor.
            </p>
          </div>
        </div>

        {/* Botão Conversar com o outro leitor */}
        <button
          onClick={onChat}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-4 font-bold text-purple-950 active:scale-95"
        >
          <MessageCircle className="h-5 w-5" /> Conversar com o outro leitor
        </button>

        {/* Simulação de status (protótipo) */}
        {trackStep < TRACK_STEPS.length - 1 && (
          <button
            onClick={() => setTrackStep((s) => Math.min(s + 1, TRACK_STEPS.length - 1))}
            className="mt-4 w-full rounded-full border border-purple-700 px-4 py-2 text-[11px] font-medium text-purple-400 underline underline-offset-2 active:scale-95"
          >
            Simular próximo status
          </button>
        )}
        {trackStep < TRACK_STEPS.length - 1 && (
          <p className="mt-2 text-center text-[10px] text-purple-600">Botão de teste do protótipo</p>
        )}
      </div>

      {/* Botão Voltar para Matches na base */}
      <div className="shrink-0 border-t border-purple-800 bg-purple-900 px-5 py-3">
        <button
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-800 py-3.5 font-semibold text-purple-100 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" /> Voltar para Matches
        </button>
      </div>
    </div>
  );
}
