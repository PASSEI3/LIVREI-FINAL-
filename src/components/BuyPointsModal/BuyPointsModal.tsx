import { useState } from 'react';
import { Copy, Check, QrCode, Shield, X, BookOpen, Sparkles } from 'lucide-react';
import { PAGES_PACK_SIZE, PAGES_PACK_PRICE } from '@/data';

interface Props {
  onClose: () => void;
  onPurchased: () => void;
}

function generatePixCode(): string {
  return `00020126360014BR.GOV.BCB.PIX0114passei@troca.com5204000053039865802BR5913LIVREI TROCA6009SAO PAULO62070503PAG6307${PAGES_PACK_PRICE
    .toFixed(2)
    .replace(/[^0-9]/g, '')
    .slice(-4)}`;
}

export function BuyPointsModal({ onClose, onPurchased }: Props) {
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const pixCode = generatePixCode();

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePay = () => {
    setPaid(true);
    setTimeout(() => {
      onPurchased();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-purple-950/80 backdrop-blur-sm">
      <div className="animate-slide-up flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-4xl bg-purple-900 no-scrollbar">
        <div className="sticky top-0 flex items-center justify-between border-b border-purple-800 bg-purple-900 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint-400 text-purple-950">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="text-base font-bold text-purple-50">Comprar Moedas</h2>
          </div>
          <button onClick={onClose} className="text-purple-300 active:scale-90" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {!paid ? (
            <>
              <div className="mb-4 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-purple-800 to-purple-950 p-4 ring-1 ring-mint-400/40">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mint-400 text-purple-950">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-purple-50">{PAGES_PACK_SIZE} Moedas</p>
                  <p className="text-sm text-purple-300">Pacote único</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-extrabold text-mint-400">R$ {PAGES_PACK_PRICE.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>

              <p className="mb-4 text-xs text-purple-300">
                Com Moedas você solicita trocas e libera livros da sua Lista de Desejos. Você também ganha Moedas cadastrando livros na sua estante.
              </p>

              <div className="mb-4 rounded-2xl bg-white p-4">
                <div className="flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-xl bg-purple-950">
                    <QrCode className="h-32 w-32 text-purple-100" />
                    <div className="absolute right-2 top-2 text-xs">🟣</div>
                    <div className="absolute bottom-2 left-2 text-xs">📄</div>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs font-medium text-purple-700">Escaneie o QR Code ou copie o código</p>
              </div>

              <button
                onClick={handleCopy}
                className="mb-3 flex w-full items-center justify-between gap-2 rounded-2xl bg-purple-800 p-3 text-left active:scale-[0.98]"
              >
                <span className="truncate font-mono text-xs text-purple-200">{pixCode}</span>
                {copied ? (
                  <Check className="h-5 w-5 shrink-0 text-mint-400" />
                ) : (
                  <Copy className="h-5 w-5 shrink-0 text-purple-300" />
                )}
              </button>

              <button
                onClick={handleSimulatePay}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-4 font-bold text-purple-950 active:scale-95"
              >
                <Shield className="h-5 w-5" /> Simular pagamento Pix
              </button>
              <p className="mt-2 text-center text-[10px] text-purple-400">
                Ambiente de teste. Nenhum valor real é cobrado.
              </p>
            </>
          ) : (
            <div className="animate-scale-in flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mint-400">
                <Check className="h-10 w-10 text-purple-950" />
              </div>
              <h3 className="text-lg font-bold text-purple-50">Pagamento confirmado!</h3>
              <p className="mt-1 text-sm text-purple-300">
                <span className="font-bold text-mint-400">+{PAGES_PACK_SIZE} Moedas</span> adicionadas ao seu saldo.
              </p>
              <div className="mt-5 flex items-center gap-2 rounded-full bg-mint-400/10 px-4 py-2 text-sm text-mint-200">
                <BookOpen className="h-4 w-4" /> Saldo atualizado
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
