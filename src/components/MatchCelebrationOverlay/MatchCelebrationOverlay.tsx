import { useEffect, useState } from 'react';
import { Heart, X, BookOpen } from 'lucide-react';
import type { Book } from '@/types';
import { BookCover } from '@/components/BookCover/BookCover';

interface Props {
  bookFrom: Book;
  bookTo: Book;
  partnerName: string;
  partnerEmoji: string;
  onGoToCheckout: () => void;
  onClose: () => void;
}

export function MatchCelebrationOverlay({ bookFrom, bookTo, partnerName, partnerEmoji, onGoToCheckout, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 transition-opacity duration-250 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: 'rgba(46, 16, 54, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-5 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-purple-800/60 text-purple-200 active:scale-90"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className={`mb-6 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <h1 className="text-center text-3xl font-extrabold leading-tight text-mint-400 drop-shadow-lg">
          É um Match Literário! 📚✨
        </h1>
      </div>

      {/* 3D crossing book covers */}
      <div
        className={`relative mb-6 flex h-48 items-center justify-center transition-all delay-100 duration-500 ${
          visible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{ perspective: '800px' }}
      >
        {/* Left book — tilted left */}
        <div
          className="absolute left-2 z-10"
          style={{ transform: 'rotateY(25deg) rotateZ(-12deg) translateX(20px)' }}
        >
          <BookCover book={bookFrom} className="h-44 w-32 shadow-2xl" emojiSize="text-4xl" />
        </div>
        {/* Right book — tilted right */}
        <div
          className="absolute right-2 z-20"
          style={{ transform: 'rotateY(-25deg) rotateZ(12deg) translateX(-20px)' }}
        >
          <BookCover book={bookTo} className="h-44 w-32 shadow-2xl" emojiSize="text-4xl" />
        </div>
      </div>

      {/* Avatars + heart */}
      <div
        className={`mb-6 flex items-center justify-center gap-3 transition-all delay-200 duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-800 text-2xl ring-2 ring-mint-400/50 shadow-lg">
          🐼
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-400/20 ring-1 ring-mint-400/40">
          <Heart className="h-5 w-5 fill-mint-400 text-mint-400" />
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-800 text-2xl ring-2 ring-mint-400/50 shadow-lg">
          {partnerEmoji}
        </div>
      </div>

      {/* Info text */}
      <p
        className={`mb-7 max-w-sm text-center text-sm leading-relaxed text-purple-200 transition-all delay-300 duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        Vocês têm interesse mútuo! A troca dos livros custa Zero Moedas para ambos.
        Para liberar os endereços e etiquetas de postagem, cada um contribui com a{' '}
        <span className="font-semibold text-mint-300">Taxa de Manutenção Compartilhada</span> de R$ 2,00 no Pix.
      </p>

      {/* Action buttons */}
      <div
        className={`flex w-full max-w-sm flex-col items-center gap-3 transition-all delay-400 duration-500 ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <button
          onClick={onGoToCheckout}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-4 font-bold text-purple-950 shadow-lg shadow-mint-400/30 active:scale-95"
        >
          <BookOpen className="h-5 w-5" />
          Ir para o Checkout de Frete
        </button>
        <button
          onClick={handleClose}
          className="text-sm font-semibold text-purple-300 underline underline-offset-4 active:scale-95"
        >
          Continuar Arrastando
        </button>
      </div>
    </div>
  );
}
