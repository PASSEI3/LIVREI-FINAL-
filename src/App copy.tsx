import { useEffect, useState } from 'react';
import { Home, Search, ScanLine, Heart, User } from 'lucide-react';
import type { Book, BookListing, MatchEntry, MeetupPoint, TradeHistoryEntry, WishlistEntry, DeliveryMethod, HandoffRole, UserPreferences } from '@/types';
import { FEED_LISTINGS, INITIAL_MATCHES, MY_SHELF, USER_WISHLIST, TRADE_HISTORY, INITIAL_PAGES, PAGES_PACK_SIZE, TRADE_COST_PAGES, SHELF_LIKERS, GENRE_CATEGORY_MAP, DEFAULT_PREFERENCES, type ShelfLiker } from '@/data';
import { FeedScreen } from '@/components/FeedScreen';
import { SearchScreen } from '@/components/SearchScreen';
import { ScanScreen } from '@/components/ScanScreen';
import { MatchScreen } from '@/components/MatchScreen';
import { ProfileScreen } from '@/components/ProfileScreen';
import { PaymentScreen } from '@/components/PaymentScreen';
import { ChatScreen } from '@/components/ChatScreen';
import { HandoffScreen } from '@/components/HandoffScreen';
import { BuyPointsModal } from '@/components/BuyPointsModal';
import { BookDetailScreen } from '@/components/BookDetailScreen';
import { ShippingInstructions } from '@/components/ShippingInstructions';
import { ShelfViewerScreen } from '@/components/ShelfViewerScreen';
import { SignUpScreen } from '@/components/SignUpScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { TermsScreen } from '@/components/TermsScreen';

type Tab = 'feed' | 'search' | 'scan' | 'matches' | 'profile';

const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'feed', label: 'Descobrir', icon: Home },
  { id: 'search', label: 'Buscar', icon: Search },
  { id: 'scan', label: 'Cadastrar', icon: ScanLine },
  { id: 'matches', label: 'Matches', icon: Heart },
  { id: 'profile', label: 'Perfil', icon: User },
];

function App() {
  const [signedUp, setSignedUp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [tab, setTab] = useState<Tab>('feed');
  const [shelf, setShelf] = useState<Book[]>(MY_SHELF);
  const [wishlist, setWishlist] = useState<WishlistEntry[]>(USER_WISHLIST);
  const [matches, setMatches] = useState<MatchEntry[]>(INITIAL_MATCHES);
  const [meetups, setMeetups] = useState<Record<string, MeetupPoint>>({});
  const [history, setHistory] = useState<TradeHistoryEntry[]>(TRADE_HISTORY);
  const [coins, setCoins] = useState<number>(INITIAL_PAGES);
  const [payMatch, setPayMatch] = useState<MatchEntry | null>(null);
  const [chatMatch, setChatMatch] = useState<MatchEntry | null>(null);
  const [handoff, setHandoff] = useState<{ match: MatchEntry; role: HandoffRole } | null>(null);
  const [detailListing, setDetailListing] = useState<BookListing | null>(null);
  const [showBuyPoints, setShowBuyPoints] = useState(false);
  const [shipping, setShipping] = useState<{ match: MatchEntry; method: DeliveryMethod; meetup?: MeetupPoint } | null>(null);
  const [viewedLiker, setViewedLiker] = useState<ShelfLiker | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [toast, setToast] = useState<string | null>(null);
  const [matchSection, setMatchSection] = useState<'likers' | 'ongoing' | 'history'>('likers');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const handleLike = (listing: BookListing) => {
    const already = wishlist.some((w) => w.bookId === listing.book.id);
    if (!already) {
      setWishlist((w) => [
        {
          bookId: listing.book.id,
          title: listing.book.title,
          author: listing.book.author,
          coverClass: listing.book.coverClass,
          coverEmoji: listing.book.coverEmoji,
        },
        ...w,
      ]);
    }
    if (Math.random() < 0.35) {
      setMatches((m) => [
        {
          id: `mt-${Date.now()}`,
          kind: Math.random() < 0.7 ? 'direto' : 'triangulado',
          bookFrom: listing.book,
          bookTo: shelf[Math.floor(Math.random() * shelf.length)],
          partnerName: 'Marina',
          partnerEmoji: '🦊',
          partnerCity: 'São Paulo - SP',
          thirdPartyName: 'Léo',
          thirdPartyBook: undefined,
          status: 'novo',
          createdAt: '2026-10-25',
        },
        ...m,
      ]);
      setToast('Deu match! Confira na aba Matches 💚');
    } else {
      setToast('Adicionado à sua Lista de Desejos');
    }
  };

  const handleAddBook = (book: Book) => {
    setShelf((s) => [book, ...s]);
    setCoins((p) => p + PAGES_PACK_SIZE);
    setToast(`Livro adicionado · +${PAGES_PACK_SIZE} Moedas ganhas`);
    setTab('profile');
  };

  const handleBuyCoins = () => {
    setCoins((p) => p + PAGES_PACK_SIZE);
    setShowBuyPoints(false);
    setToast(`+${PAGES_PACK_SIZE} Moedas adicionadas ao seu saldo`);
  };

  const hasDirectMatchForListing = (listing: BookListing): boolean => {
    return matches.some(
      (m) => m.kind === 'direto' && m.bookFrom.id === listing.book.id && m.status !== 'finalizado'
    );
  };

  const handleRequestTrade = (listing: BookListing) => {
    setDetailListing(null);
    const hasMatch = hasDirectMatchForListing(listing);
    if (hasMatch) {
      setToast('Match Direto! Taxa de R$ 2,00 para cada lado');
      return;
    }
    if (coins < TRADE_COST_PAGES) {
      setShowBuyPoints(true);
      return;
    }
    setCoins((p) => p - TRADE_COST_PAGES);
    setToast(`Troca solicitada! ${TRADE_COST_PAGES} Moedas reservadas`);
  };

  const handlePaid = (method: DeliveryMethod, meetup?: MeetupPoint) => {
    if (payMatch) {
      const id = payMatch.id;
      if (meetup) setMeetups((prev) => ({ ...prev, [id]: meetup }));
      setPayMatch(null);
      setShipping({ match: { ...payMatch, status: 'conversando' }, method, meetup });
    }
  };

  const handleShippingDone = () => {
    if (!shipping) return;
    const id = shipping.match.id;
    if (shipping.method === 'local' || shipping.method === 'courier') {
      setMatches((m) => m.map((x) => (x.id === id ? { ...x, status: 'conversando' } : x)));
      setChatMatch(shipping.match);
      setToast('Instruções concluídas! Combine os detalhes no chat 🤝');
    } else {
      setMatches((m) => m.map((x) => (x.id === id ? { ...x, status: 'finalizado' } : x)));
      setToast('Etiqueta liberada! Boa postagem 📦');
    }
    setShipping(null);
  };

  const handleHandoffConfirmed = () => {
    if (handoff) {
      const id = handoff.match.id;
      setMatches((m) => m.map((x) => (x.id === id ? { ...x, status: 'finalizado' } : x)));
      setHistory((h) => [
        {
          id: `t-${Date.now()}`,
          bookTitle: handoff.match.bookFrom.title,
          partnerName: handoff.match.partnerName,
          date: new Date().toLocaleDateString('pt-BR'),
          status: 'trocado',
        },
        ...h,
      ]);
      setHandoff(null);
      setToast('Troca concluída presencialmente! 🎉');
    }
  };

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col bg-purple-950">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-400 text-lg font-black text-purple-950">
            P
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-none text-purple-50">Passei</h1>
            <p className="text-[10px] font-medium text-purple-400">Troca de Livros</p>
          </div>
        </div>
        {tab === 'matches' && matches.some((m) => m.status === 'novo') && (
          <span className="flex h-2 w-2 rounded-full bg-mint-400" />
        )}
      </header>

      <main className="relative flex-1 overflow-hidden">
        <div className={tab === 'feed' ? 'h-full' : 'hidden'}>
          <FeedScreen
            listings={FEED_LISTINGS}
            preferences={preferences}
            likedShelfBooks={shelf.filter((b) => SHELF_LIKERS.some((l) => l.likedBookId === b.id))}
            likerCount={SHELF_LIKERS.length}
            activeMatchCount={matches.filter((m) => m.status === 'novo' || m.status === 'conversando').length}
            newMatchCount={matches.filter((m) => m.status === 'novo').length}
            onLike={handleLike}
            onPass={() => {}}
            onOpenDetail={setDetailListing}
            onViewLikers={() => { setMatchSection('likers'); setTab('matches'); }}
            onGoToLikers={() => { setMatchSection('likers'); setTab('matches'); }}
            onGoToMatches={() => { setMatchSection('ongoing'); setTab('matches'); }}
          />
        </div>
        <div className={tab === 'search' ? 'h-full' : 'hidden'}>
          <SearchScreen listings={FEED_LISTINGS} preferences={preferences} />
        </div>
        <div className={tab === 'scan' ? 'h-full' : 'hidden'}>
          <ScanScreen onAdd={handleAddBook} />
        </div>
        <div className={tab === 'matches' ? 'h-full' : 'hidden'}>
          <MatchScreen
            matches={matches}
            meetups={meetups}
            likers={SHELF_LIKERS}
            initialSection={matchSection}
            onPay={setPayMatch}
            onChat={setChatMatch}
            onOpenLiker={setViewedLiker}
          />
        </div>
        <div className={tab === 'profile' ? 'h-full' : 'hidden'}>
          <ProfileScreen
            shelf={shelf}
            wishlist={wishlist}
            history={history}
            pages={coins}
            onAddBook={() => setTab('scan')}
            onBuyPoints={() => setShowBuyPoints(true)}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
      </main>

      <nav className="flex items-center justify-around border-t border-purple-800 bg-purple-900/80 px-2 pb-[env(safe-area-inset-bottom)] pt-2 glass">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          const isScan = t.id === 'scan';
          if (isScan) {
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex flex-col items-center gap-0.5"
                aria-label={t.label}
              >
                <div className={`flex h-12 w-12 -translate-y-3 items-center justify-center rounded-full ring-4 ring-purple-950 transition active:scale-90 ${
                  active ? 'bg-mint-400 text-purple-950' : 'bg-purple-700 text-purple-100'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="-translate-y-2 text-[10px] font-medium text-purple-300">{t.label}</span>
              </button>
            );
          }
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex flex-col items-center gap-0.5 py-1 active:scale-90"
              aria-label={t.label}
            >
              <Icon className={`h-5 w-5 transition ${active ? 'text-mint-400' : 'text-purple-400'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-mint-400' : 'text-purple-400'}`}>{t.label}</span>
            </button>
          );
        })}
      </nav>

      {payMatch && (
        <PaymentScreen match={payMatch} onClose={() => setPayMatch(null)} onPaid={handlePaid} />
      )}

      {chatMatch && (
        <ChatScreen
          match={chatMatch}
          meetup={meetups[chatMatch.id]}
          onClose={() => setChatMatch(null)}
          onStartHandoff={(m) => {
            setChatMatch(null);
            setHandoff({ match: m, role: 'recebendo' });
          }}
        />
      )}

      {handoff && (
        <HandoffScreen
          match={handoff.match}
          role={handoff.role}
          meetup={meetups[handoff.match.id]}
          onClose={() => setHandoff(null)}
          onConfirmed={handleHandoffConfirmed}
        />
      )}

      {detailListing && (
        <BookDetailScreen
          listing={detailListing}
          balance={coins}
          hasDirectMatch={hasDirectMatchForListing(detailListing)}
          onRequest={handleRequestTrade}
          onBuyCoins={() => {
            setDetailListing(null);
            setShowBuyPoints(true);
          }}
          onClose={() => setDetailListing(null)}
        />
      )}

      {viewedLiker && (
        <ShelfViewerScreen liker={viewedLiker} onClose={() => setViewedLiker(null)} />
      )}

      {shipping && (
        <ShippingInstructions
          match={shipping.match}
          method={shipping.method}
          meetup={shipping.meetup}
          onDone={handleShippingDone}
        />
      )}

      {showBuyPoints && (
        <BuyPointsModal onClose={() => setShowBuyPoints(false)} onPurchased={handleBuyCoins} />
      )}

      {showSettings && (
        <SettingsScreen
          onOpenTerms={() => setShowTerms(true)}
          onClose={() => setShowSettings(false)}
          onSignOut={() => {
            setShowSettings(false);
            setSignedUp(false);
          }}
        />
      )}

      {showTerms && (
        <TermsScreen onClose={() => setShowTerms(false)} />
      )}

      {!signedUp && (
        <SignUpScreen onComplete={(prefs) => { setPreferences(prefs); setSignedUp(true); }} onSkip={() => setSignedUp(true)} />
      )}

      {toast && (
        <div className="animate-slide-up pointer-events-none fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-mint-400 px-5 py-2.5 text-sm font-semibold text-purple-950 shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
