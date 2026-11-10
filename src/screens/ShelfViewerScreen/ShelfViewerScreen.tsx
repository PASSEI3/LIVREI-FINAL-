import { X, BookOpen, Heart, Star, ArrowLeftRight } from 'lucide-react';
import type { Book } from '@/types';
import type { ShelfLiker } from '@/data';
import { BookCover } from '@/components/BookCover/BookCover';

interface Props {
  liker: ShelfLiker;
  onClose: () => void;
}

const conditionColor: Record<string, string> = {
  'Novo/Lacrado': 'bg-mint-400 text-purple-950',
  'Seminovo': 'bg-mint-300 text-purple-950',
  'Bom Estado': 'bg-purple-300 text-purple-900',
  'Marcas de Uso': 'bg-purple-200 text-purple-900',
};

export function ShelfViewerScreen({ liker, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-950">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900 text-purple-200 active:scale-90"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-bold text-purple-50">Estante de {liker.name}</h2>
        <div className="h-9 w-9" />
      </div>

      {/* Aviso de destaque */}
      <div className="mx-4 mb-3 flex items-start gap-2.5 rounded-2xl bg-mint-400/10 p-3.5 ring-1 ring-mint-400/30">
        <Heart className="mt-0.5 h-4 w-4 shrink-0 fill-mint-400 text-mint-400" />
        <p className="text-xs leading-relaxed text-mint-200">
          <span className="font-semibold text-mint-300">{liker.name}</span> quer um livro seu!
          Explore a estante abaixo e dê um Gostei em algum exemplar para gerar um{' '}
          <span className="font-semibold text-mint-300">Match Direto e Grátis!</span>
        </p>
      </div>

      {/* Perfil do leitor */}
      <div className="mx-4 mb-4 flex items-center gap-3 rounded-2xl bg-purple-900/60 p-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 text-2xl">
          {liker.avatarEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-purple-50">{liker.name}</p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-purple-300">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-mint-400 text-mint-400" />
              {liker.rating}
            </span>
            <span>·</span>
            <span>{liker.tradesCount} trocas</span>
          </div>
        </div>
        <span className="rounded-full bg-purple-800 px-3 py-1 text-[10px] font-medium text-purple-200">
          {liker.city}
        </span>
      </div>

      {/* Grade de livros */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-mint-400" />
          <p className="text-xs font-semibold text-purple-300">
            {liker.shelf.length} {liker.shelf.length === 1 ? 'livro' : 'livros'} disponíveis para troca
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {liker.shelf.map((book: Book) => (
            <div
              key={book.id}
              className="flex flex-col overflow-hidden rounded-2xl bg-purple-900/60 p-3 ring-1 ring-purple-800 active:scale-[0.98]"
            >
              <div className="flex justify-center">
                <BookCover book={book} className="h-32 w-22" emojiSize="text-3xl" />
              </div>
              <h3 className="mt-2 truncate text-xs font-bold text-purple-50">{book.title}</h3>
              <p className="truncate text-[10px] text-purple-300">{book.author}</p>
              <span
                className={`mt-1.5 w-fit rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  conditionColor[book.condition] || 'bg-purple-800 text-purple-100'
                }`}
              >
                {book.condition}
              </span>
              <button
                className="mt-2 flex items-center justify-center gap-1 rounded-full bg-purple-800 py-2 text-[11px] font-semibold text-purple-200 active:scale-95"
                onClick={() => {}}
              >
                <Heart className="h-3.5 w-3.5" /> Dar Gostei
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé */}
      <div className="border-t border-purple-800 p-4">
        <button
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 font-bold text-purple-950 active:scale-95"
        >
          <ArrowLeftRight className="h-5 w-5" />
          Voltar aos Matches
        </button>
      </div>
    </div>
  );
}
