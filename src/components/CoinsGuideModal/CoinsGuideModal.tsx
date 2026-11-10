import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const REWARDS = [
  { emoji: '🎁', text: 'Ganhe 10,0 Moedas: Basta cadastrar o seu primeiro livro para liberar o seu saldo inicial!' },
  { emoji: '📚', text: 'Ganhe +10,0 Moedas: Sempre que outro leitor escolher um livro comum da sua estante e a entrega for confirmada.' },
  { emoji: '💎', text: 'Ganhe +30,0 Moedas: Sempre que outro leitor escolher um livro caro (didático, técnico ou faculdade) da sua estante e receber o pacote.' },
  { emoji: '✨', text: 'Bônus de Estante Cheia: Cadastre mais livros e ganhe +0,5 moeda por cada livro extra adicionado (Até o limite de 10,0 moedas extras).' },
];

export function CoinsGuideModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-950/70 p-4 backdrop-blur-md animate-fade-in">
      <div className="animate-slide-up flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-4xl bg-purple-900 shadow-2xl ring-1 ring-purple-700">
        <div className="flex items-start justify-between gap-3 px-6 pb-3 pt-6">
          <h2 className="text-xl font-extrabold leading-tight text-purple-50">Como ganhar mais Moedas? 🚀</h2>
          <button onClick={onClose} className="shrink-0 text-purple-300 active:scale-90" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-2 no-scrollbar">
          <p className="text-sm leading-relaxed text-purple-200">
            No LIVREI, a forma mais rápida e inteligente de aumentar o seu saldo é ajudando a comunidade a ler mais! Você ganha créditos direto na carteira fazendo a sua estante girar:
          </p>
          <ul className="mt-4 space-y-3">
            {REWARDS.map((reward) => (
              <li key={reward.emoji} className="flex items-start gap-3 rounded-2xl bg-purple-800/50 p-3.5">
                <span className="text-lg leading-none">{reward.emoji}</span>
                <p className="text-sm leading-relaxed text-purple-100">{reward.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 pb-6 pt-4">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-mint-400 py-3.5 text-sm font-bold text-purple-950 shadow-lg shadow-mint-400/20 transition active:scale-95"
          >
            Entendi, vou cadastrar livros!
          </button>
        </div>
      </div>
    </div>
  );
}
