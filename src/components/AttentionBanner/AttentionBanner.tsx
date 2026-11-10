import { AlertTriangle, X } from 'lucide-react';

interface Props {
  onOpen: () => void;
  onDismiss: () => void;
}

export function AttentionBanner({ onOpen, onDismiss }: Props) {
  return (
    <div className="flex w-full animate-fade-in items-start gap-2.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 backdrop-blur-sm">
      <button
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-start gap-2.5 text-left transition active:scale-[0.99]"
      >
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/20">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-amber-200">Atenção</p>
          <p className="text-[11px] leading-relaxed text-amber-100/80">
            Algumas solicitações expirarão em 48h úteis se o pagamento compartilhado não for confirmado. Toque para resolver.
          </p>
        </div>
      </button>
      <button
        onClick={onDismiss}
        className="mt-0.5 shrink-0 rounded-full p-1 text-amber-300/70 transition hover:bg-amber-400/10 hover:text-amber-200 active:scale-90"
        aria-label="Dispensar aviso"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
