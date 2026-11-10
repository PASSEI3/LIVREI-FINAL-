import { useState } from 'react';
import { Star, Settings, BookMarked, Heart, History, Plus, BookOpen, Receipt, Lock, Sparkles, Info, Clock } from 'lucide-react';
import type { Book, WishlistEntry, TradeHistoryEntry } from '@/types';
import { BookCover } from '@/components/BookCover/BookCover';
import { CoinsGuideModal } from '@/components/CoinsGuideModal/CoinsGuideModal';
import { CURRENT_USER, PROMO_CAP } from '@/data';
import type { WalletEntry } from '@/data';

interface Props {
  shelf: Book[];
  wishlist: WishlistEntry[];
  history: TradeHistoryEntry[];
  pages: number;
  wallet: WalletEntry[];
  promoCoins: number;
  onAddBook: () => void;
  onOpenSettings: () => void;
}

type Tab = 'shelf' | 'wishlist' | 'history';

const statusLabel: Record<TradeHistoryEntry['status'], string> = {
  enviado: 'Enviado',
  recebido: 'Recebido',
  trocado: 'Trocado',
};

function formatCoins(value: number): string {
  return value.toFixed(1).replace('.', ',');
}

export function ProfileScreen({ shelf, wishlist, history, pages, wallet, promoCoins, onAddBook, onOpenSettings }: Props) {
  const [tab, setTab] = useState<Tab>('shelf');
  const [showCoinsGuide, setShowCoinsGuide] = useState(false);
  const welcomeLocked = wallet.some((w) => w.type === 'bonus' && w.locked);

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 no-scrollbar">
      <div className="mt-2 flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-800 text-4xl shadow-lg ring-2 ring-mint-400">
          {CURRENT_USER.avatarEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-purple-50">{CURRENT_USER.name}</h2>
          <p className="text-sm text-purple-300">{CURRENT_USER.city}</p>
          <div className="mt-1 flex items-center gap-3 text-xs text-purple-300">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-mint-400 text-mint-400" />
              {CURRENT_USER.rating}
            </span>
            <span>{CURRENT_USER.tradesCount} trocas</span>
          </div>
        </div>
        <button onClick={onOpenSettings} className="text-purple-300 transition active:scale-90" aria-label="Configurações">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Moedas balance + buy button */}
      <div className="mt-4 flex items-center gap-3 rounded-3xl bg-gradient-to-r from-purple-800 to-purple-900 p-3 ring-1 ring-purple-700">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint-400 text-purple-950">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-purple-300">Seu saldo</p>
          <p className="text-lg font-extrabold text-purple-50">
            {formatCoins(pages)} <span className="text-sm font-semibold text-mint-400">Moedas</span>
          </p>
          {welcomeLocked && (
            <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-amber-400">
              <Lock className="h-3 w-3" />
              10,0 Moedas de boas-vindas bloqueadas · cadastre 1 livro
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCoinsGuide(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-mint-400 px-4 py-2.5 text-sm font-bold text-purple-950 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Adquirir Moedas
        </button>
      </div>

      {/* Extrato da Carteira */}
      <div className="mt-4 overflow-hidden rounded-3xl bg-purple-900/60 ring-1 ring-purple-800">
        <div className="flex items-center gap-2 border-b border-purple-800 px-4 py-3">
          <Receipt className="h-4 w-4 text-mint-400" />
          <h3 className="text-sm font-bold text-purple-50">Extrato da Carteira</h3>
          <span className="ml-auto text-[10px] font-medium text-purple-400">
            Promo: {formatCoins(promoCoins)} / {formatCoins(PROMO_CAP)}
          </span>
        </div>

        <div className="max-h-56 overflow-y-auto px-4 py-3 no-scrollbar">
          <div className="space-y-2.5">
            {wallet.map((entry) => {
              const isInfo = entry.type === 'info';
              const isLocked = entry.locked;
              const isExpiry = entry.type === 'expiry';
              const Icon = isLocked ? Lock : isInfo ? Info : isExpiry ? Clock : entry.type === 'bonus' ? Sparkles : BookMarked;

              if (isInfo) {
                return (
                  <div key={entry.id} className="flex items-start gap-2.5 rounded-2xl bg-purple-800/40 p-3">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                    <p className="text-[11px] leading-relaxed text-purple-300">{entry.label}</p>
                  </div>
                );
              }

              if (isExpiry) {
                return (
                  <div key={entry.id} className="flex items-start gap-2.5 rounded-2xl bg-purple-800/40 p-3">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
                    <p className="text-[11px] leading-relaxed text-purple-300">{entry.label}</p>
                  </div>
                );
              }

              return (
                <div
                  key={entry.id}
                  className={`flex items-center gap-2.5 rounded-2xl p-3 ${
                    isLocked ? 'bg-amber-400/10 ring-1 ring-amber-400/30' : 'bg-mint-400/10 ring-1 ring-mint-400/20'
                  }`}
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isLocked ? 'bg-amber-400/20' : 'bg-mint-400/20'
                  }`}>
                    <Icon className={`h-4 w-4 ${isLocked ? 'text-amber-400' : 'text-mint-400'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold ${isLocked ? 'text-amber-300' : 'text-mint-300'}`}>
                      +{formatCoins(entry.amount)} {entry.amount === 1 ? 'Moeda' : 'Moedas'}
                    </p>
                    <p className="mt-0.5 truncate text-[10px] text-purple-300">{entry.label}</p>
                  </div>
                  {isLocked && (
                    <span className="shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-[9px] font-bold text-amber-300">
                      Bloqueado
                    </span>
                  )}
                </div>
              );
            })}

            {/* Static informational entries */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-purple-800/40 p-3">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
              <p className="text-[11px] leading-relaxed text-purple-300">
                🔒 Limite promocional de acervo: Máximo 10,0 moedas extras.
              </p>
            </div>
            <div className="flex items-start gap-2.5 rounded-2xl bg-purple-800/40 p-3">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-400" />
              <p className="text-[11px] leading-relaxed text-purple-300">
                ⏳ Validade: As moedas ganhas expiram em 90 dias se não forem utilizadas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex rounded-full bg-purple-900 p-1">
        <TabBtn active={tab === 'shelf'} onClick={() => setTab('shelf')} icon={<BookMarked className="h-4 w-4" />} label="Estante" count={shelf.length} />
        <TabBtn active={tab === 'wishlist'} onClick={() => setTab('wishlist')} icon={<Heart className="h-4 w-4" />} label="Desejos" count={wishlist.length} />
        <TabBtn active={tab === 'history'} onClick={() => setTab('history')} icon={<History className="h-4 w-4" />} label="Histórico" count={history.length} />
      </div>

      <div className="mt-4">
        {tab === 'shelf' && (
          <div>
            <button
              onClick={onAddBook}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple-700 py-3 text-sm font-semibold text-purple-300 active:scale-[0.98]"
            >
              <Plus className="h-5 w-5 text-mint-400" /> Cadastrar novo livro
            </button>
            <div className="grid grid-cols-3 gap-3">
              {shelf.map((b) => (
                <div key={b.id}>
                  <BookCover book={b} className="aspect-[3/4] w-full" emojiSize="text-3xl" />
                  <p className="mt-1 truncate text-[11px] font-semibold text-purple-100">{b.title}</p>
                  <p className="truncate text-[10px] text-purple-400">{b.condition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'wishlist' && (
          <div className="grid grid-cols-3 gap-3">
            {wishlist.map((w) => (
              <div key={w.bookId}>
                <div className="relative">
                  <BookCover book={w} className="aspect-[3/4] w-full" emojiSize="text-3xl" />
                  <div className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-mint-400">
                    <Heart className="h-3.5 w-3.5 fill-purple-950 text-purple-950" />
                  </div>
                </div>
                <p className="mt-1 truncate text-[11px] font-semibold text-purple-100">{w.title}</p>
                <p className="truncate text-[10px] text-purple-400">{w.author}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 rounded-2xl bg-purple-900/60 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-800 text-lg">📖</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-purple-50">{h.bookTitle}</p>
                  <p className="text-xs text-purple-300">com {h.partnerName} · {h.date}</p>
                </div>
                <span className="rounded-full bg-purple-800 px-2.5 py-1 text-[10px] font-semibold text-mint-400">
                  {statusLabel[h.status]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCoinsGuide && <CoinsGuideModal onClose={() => setShowCoinsGuide(false)} />}
    </div>
  );
}

function TabBtn({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition ${
        active ? 'bg-mint-400 text-purple-950' : 'text-purple-300'
      }`}
    >
      {icon}
      <span>{label}</span>
      <span className={`text-[10px] ${active ? 'text-purple-800' : 'text-purple-500'}`}>{count}</span>
    </button>
  );
}
