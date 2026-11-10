import type { Book } from '@/types';

interface Props {
  book: Pick<Book, 'title' | 'author' | 'coverClass' | 'coverEmoji'>;
  className?: string;
  emojiSize?: string;
}

export function BookCover({ book, className = '', emojiSize = 'text-6xl' }: Props) {
  return (
    <div className={`${book.coverClass} ${className} relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <span className={`${emojiSize} drop-shadow-lg`}>{book.coverEmoji}</span>
        <div className="h-2 w-2 rounded-full bg-white/40" />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight text-white drop-shadow line-clamp-2">{book.title}</p>
        <p className="mt-1 text-xs text-white/80 line-clamp-1">{book.author}</p>
      </div>
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-black/10" />
    </div>
  );
}
