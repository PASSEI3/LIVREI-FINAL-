import { useState, useMemo, useRef, useCallback } from 'react';
import { Heart, X, MapPin, Radar, RotateCcw, Info, Bike, Sparkles, Rocket, Users, Eye, HeartHandshake } from 'lucide-react';
import type { BookListing, UserPreferences, Book } from '@/types';
import { CURRENT_USER, GENRE_CATEGORY_MAP, MY_SHELF } from '@/data';
import { RadarScreen } from '@/screens/RadarScreen';
import { BookDetailScreen } from '@/screens/BookDetailScreen/BookDetailScreen';
import { BookCover } from '@/components/BookCover/BookCover';
import { AttentionBanner } from '@/components/AttentionBanner/AttentionBanner';
import { CoinsGuideModal } from '@/components/CoinsGuideModal/CoinsGuideModal';
import { MatchCelebrationOverlay } from '@/components/MatchCelebrationOverlay/MatchCelebrationOverlay';

interface Props {
  listings: BookListing[];
  preferences: UserPreferences;
  likedShelfBooks: Book[];
  likerCount: number;
  activeMatchCount: number;
  newMatchCount: number;
  onLike: (listing: BookListing) => void;
  onPass: (listing: BookListing) => void;
  hasDirectMatchForListing: (listing: BookListing) => boolean;
  onViewLikers: () => void;
  onGoToLikers: () => void;
  onGoToMatches: () => void;
  onGoToCheckout: (match: { bookFrom: Book; bookTo: Book; partnerName: string; partnerEmoji: string }) => void;
}

const REMINDER_INTERVAL = 5;
const MAX_REMINDER_BOOKS = 4;

type FeedItem =
  | { kind: 'listing'; listing: BookListing }
  | { kind: 'reminder'; books: Book[] };

export function FeedScreen({ listings, preferences, likedShelfBooks, likerCount, activeMatchCount, newMatchCount, onLike, onPass, hasDirectMatchForListing, onViewLikers, onGoToLikers, onGoToMatches, onGoToCheckout }: Props) {
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState<'none' | 'like' | 'pass'>('none');
  const [detailListing, setDetailListing] = useState<BookListing | null>(null);
  const [radarOpen, setRadarOpen] = useState(false);
  const [radarActive, setRadarActive] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [showCoinsGuide, setShowCoinsGuide] = useState(false);
  const [matchData, setMatchData] = useState<{ bookFrom: Book; bookTo: Book; partnerName: string; partnerEmoji: string } | null>(null);
  const dragStart = useRef<number | null>(null);
  const dragging = useRef(false);
  const dragged = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const sortedListings = useMemo(() => {
    if (preferences.genres.length === 0 && preferences.authors.length === 0) return listings;
    const scored = listings.map((l) => {
      let score = 0;
      const cat = l.book.category || '';
      const matchedGenres = preferences.genres.filter((g) =>
        (GENRE_CATEGORY_MAP[g] || []).includes(cat)
      );
      score += matchedGenres.length * 10;
      const authorLower = l.book.author.toLowerCase();
      preferences.authors.forEach((a) => {
        if (authorLower.includes(a.trim().toLowerCase())) score += 20;
      });
      return { listing: l, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.listing);
  }, [listings, preferences]);

  const reminderBooks = useMemo(
    () => likedShelfBooks.slice(0, MAX_REMINDER_BOOKS),
    [likedShelfBooks]
  );

  const feed = useMemo(() => {
    const items: FeedItem[] = [];
    const reminderCount = reminderBooks.length > 0 ? 1 : 0;
    if (reminderCount === 0) {
      sortedListings.forEach((l) => items.push({ kind: 'listing', listing: l }));
      return items;
    }
    const reminder = { kind: 'reminder' as const, books: reminderBooks };
    sortedListings.forEach((l, i) => {
      items.push({ kind: 'listing', listing: l });
      const insertedCount = items.filter((x) => x.kind === 'reminder').length;
      const nextPos = (insertedCount + 1) * REMINDER_INTERVAL;
      if (i + 1 === nextPos && insertedCount < reminderCount) {
        items.push(reminder);
      }
    });
    if (!items.some((x) => x.kind === 'reminder')) {
      items.push(reminder);
    }
    return items;
  }, [sortedListings, reminderBooks]);

  const current = feed[index];

  const handleLike = () => {
    if (!current || current.kind === 'reminder') return;
    setBannerVisible(false);
    setAnim('like');
    const wasSecondBook = index === 1;
    const listing = current.listing;
    setTimeout(() => {
      onLike(listing);
      setIndex((i) => i + 1);
      setAnim('none');
      if (wasSecondBook) {
        setMatchData({
          bookFrom: listing.book,
          bookTo: MY_SHELF[0],
          partnerName: 'Marina',
          partnerEmoji: '🦊',
        });
      }
    }, 300);
  };

  const handlePass = () => {
    if (!current) return;
    setBannerVisible(false);
    setAnim('pass');
    setTimeout(() => {
      if (current.kind === 'listing') onPass(current.listing);
      setIndex((i) => i + 1);
      setAnim('none');
    }, 300);
  };

  const handleRewind = () => {
    setBannerVisible(false);
    if (index > 0) setIndex((i) => i - 1);
  };

  const handleOpenDetail = (listing: BookListing) => {
    if (dragged.current) return;
    setBannerVisible(false);
    setDetailListing(listing);
  };

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (current?.kind !== 'listing') return;
    dragStart.current = e.clientX;
    dragging.current = true;
    dragged.current = false;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, [current]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    setDragX(dx);
    if (Math.abs(dx) > 10) {
      dragged.current = true;
      setBannerVisible(false);
    }
  }, []);

  const onPointerUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    const threshold = 100;
    if (dragX > threshold) {
      handleLike();
    } else if (dragX < -threshold) {
      handlePass();
    }
    setDragX(0);
    dragStart.current = null;
  }, [dragX]);

  if (!current) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <div className="mb-4 text-7xl">📚</div>
        <h2 className="text-xl font-bold text-purple-50">Você chegou ao fim!</h2>
        <p className="mt-2 text-purple-300">Tente novamente mais tarde ou recarregue o feed.</p>
        <button
          onClick={() => setIndex(0)}
          className="mt-6 flex items-center gap-2 rounded-full bg-mint-400 px-6 py-3 font-semibold text-purple-950 active:scale-95"
        >
          <RotateCcw className="h-5 w-5" /> Voltar ao início
        </button>
      </div>
    );
  }

  const swipeOpacity = Math.max(0.6, 1 - Math.abs(dragX) / 400);
  const swipeRotate = dragX / 18;
  const swipeScale = 1 - Math.min(0.05, Math.abs(dragX) / 2000);
  const swipeLikeHint = dragX > 30;
  const swipePassHint = dragX < -30;

  const translate = anim === 'like' ? 'translate-x-[120%] rotate-12' : anim === 'pass' ? '-translate-x-[120%] -rotate-12' : '';
  const likeBadge = anim === 'like' || swipeLikeHint;
  const passBadge = anim === 'pass' || swipePassHint;

  return (
    <div className="flex h-full flex-col px-4 pb-3">
      <div className="flex shrink-0 justify-center pb-2 pt-1">
        <button
          onClick={() => setShowCoinsGuide(true)}
          className="flex items-center gap-1.5 rounded-full bg-mint-400 px-4 py-1.5 text-[11px] font-bold text-purple-950 shadow-lg shadow-mint-400/20 transition active:scale-95"
        >
          <Sparkles className="h-3.5 w-3.5" />
          + Adquirir Moedas
        </button>
        {showCoinsGuide && <CoinsGuideModal onClose={() => setShowCoinsGuide(false)} />}
      </div>

      {/* Shortcut pills — full width, pushed to edges */}
      <div className="flex shrink-0 justify-between px-5 pb-3 pt-1">
        <button
          onClick={onGoToLikers}
          className="relative flex items-center gap-1.5 rounded-full bg-purple-800/60 px-3 py-1.5 ring-1 ring-purple-700/60 active:scale-95"
        >
          <Eye className="h-3.5 w-3.5 shrink-0 text-purple-300" />
          <span className="text-[11px] font-semibold text-purple-100">
            {likerCount} de olho
          </span>
          {likerCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mint-400 text-[9px] font-bold text-purple-950 shadow ring-2 ring-purple-900">
              {likerCount}
            </span>
          )}
        </button>
        <button
          onClick={onGoToMatches}
          className="relative flex items-center gap-1.5 rounded-full bg-purple-800/60 px-3 py-1.5 ring-1 ring-purple-700/60 active:scale-95"
        >
          <HeartHandshake className={`h-3.5 w-3.5 shrink-0 ${newMatchCount > 0 ? 'text-mint-400' : 'text-purple-300'}`} />
          <span className="text-[11px] font-semibold text-purple-100">
            {activeMatchCount} matches
          </span>
          {newMatchCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-mint-400 text-[9px] font-bold text-purple-950 shadow ring-2 ring-purple-900">
              {newMatchCount}
            </span>
          )}
        </button>
      </div>

      {/* Card area — fixed in the vertical flow, banner overlays its top */}
      <div className="relative flex shrink-0 justify-center">
        {/* Attention banner — absolute overlay sitting over the top of the card */}
        {index === 0 && newMatchCount > 0 && (
          <div
            className={`pointer-events-${bannerVisible ? 'auto' : 'none'} absolute inset-x-0 top-0 z-20 px-1 transition-all duration-300 ease-out ${
              bannerVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}
          >
            <AttentionBanner
              onOpen={onGoToMatches}
              onDismiss={() => setBannerVisible(false)}
            />
          </div>
        )}
        <div
          ref={cardRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`h-[52dvh] w-[90%] max-w-[20rem] touch-pan-y transition-transform duration-300 ${translate}`}
          style={
            dragX !== 0 && anim === 'none'
              ? { transform: `translateX(${dragX}px) rotate(${swipeRotate}deg) scale(${swipeScale})`, opacity: swipeOpacity, transition: 'none' }
              : undefined
          }
        >
          {current.kind === 'reminder' ? (
            <GiroRapidoCard books={current.books} onViewLikers={onViewLikers} />
          ) : (
            <ListingCard
              listing={current.listing}
              preferences={preferences}
              onOpenDetail={handleOpenDetail}
              likeBadge={likeBadge}
              passBadge={passBadge}
            />
          )}
        </div>
      </div>
      {current.kind === 'listing' && (
        <div className="mt-auto flex shrink-0 items-center justify-center gap-5 pb-8 pt-3">
          <button
            onClick={handleRewind}
            disabled={index === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-800 text-purple-200 disabled:opacity-30 active:scale-90"
            aria-label="Voltar"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={handlePass}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-900 shadow-lg ring-2 ring-purple-600 text-purple-200 active:scale-90"
            aria-label="Passar"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={handleLike}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-mint-400 shadow-lg text-purple-950 active:scale-90"
            aria-label="Gostei"
          >
            <Heart className="h-6 w-6 fill-current" />
          </button>
          <button
            onClick={() => {
              setBannerVisible(false);
              setRadarActive(true);
              setRadarOpen(true);
            }}
            className={`flex h-11 w-11 items-center justify-center rounded-full active:scale-90 transition ${
              radarActive
                ? 'bg-mint-400 text-purple-950 shadow-[0_0_16px_4px] shadow-mint-400/60'
                : 'bg-purple-800 text-mint-400'
            }`}
            aria-label="Radar LIVREI"
          >
            <Radar className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Simplified action row for reminder card — only pass */}
      {current.kind === 'reminder' && (
        <div className="mt-auto flex shrink-0 items-center justify-center gap-5 pb-8 pt-3">
          <button
            onClick={handleRewind}
            disabled={index === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-800 text-purple-200 disabled:opacity-30 active:scale-90"
            aria-label="Voltar"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={handlePass}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-900 shadow-lg ring-2 ring-purple-600 text-purple-200 active:scale-90"
            aria-label="Ignorar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {matchData && (
        <MatchCelebrationOverlay
          bookFrom={matchData.bookFrom}
          bookTo={matchData.bookTo}
          partnerName={matchData.partnerName}
          partnerEmoji={matchData.partnerEmoji}
          onGoToCheckout={() => {
            onGoToCheckout(matchData);
            setMatchData(null);
          }}
          onClose={() => setMatchData(null)}
        />
      )}

      {radarOpen && (
        <RadarScreen
          listings={listings}
          userCity={CURRENT_USER.city}
          onClose={() => setRadarOpen(false)}
          onOpenDetail={(l) => {
            setRadarOpen(false);
            setDetailListing(l);
          }}
        />
      )}

      {detailListing && (
        <BookDetailScreen
          listing={detailListing}
          hasDirectMatch={hasDirectMatchForListing(detailListing)}
          onLike={(listing) => {
            setDetailListing(null);
            if (current?.kind === 'listing' && current.listing.book.id === listing.book.id) {
              handleLike();
            } else {
              onLike(listing);
            }
          }}
          onClose={() => setDetailListing(null)}
        />
      )}
    </div>
  );
}

function GiroRapidoCard({ books, onViewLikers }: { books: Book[]; onViewLikers: () => void }) {
  return (
    <div className="relative flex max-h-full w-full flex-col overflow-y-auto rounded-3xl bg-purple-900/70 shadow-2xl ring-2 ring-mint-400 no-scrollbar" style={{ borderRadius: '24px' }}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-mint-400/10" />
      <div className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-mint-400/5" />

      <div className="relative flex flex-col p-5 pb-4">
        {/* Header */}
        <div className="mb-1.5 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-mint-400/15 ring-1 ring-mint-400/30">
            <Rocket className="h-4 w-4 text-mint-400" />
          </div>
          <h3 className="text-sm font-bold leading-tight text-mint-300">
            Sua estante está movimentada! 🚀
          </h3>
        </div>

        {/* Support text */}
        <p className="text-xs leading-relaxed text-purple-200">
          Estes livros da sua estante receberam curtidas de outros leitores. Visite o perfil deles para agilizar um match!
        </p>

        {/* Grid of liked shelf book covers */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          {books.map((book) => (
            <div key={book.id} className="flex flex-col items-center gap-1">
              <BookCover book={book} className="aspect-[3/4] w-full max-w-[64px]" emojiSize="text-xl" />
              <p className="line-clamp-1 w-full text-center text-[8px] font-semibold text-purple-300">{book.title}</p>
            </div>
          ))}
        </div>

        {/* Redirect button — safe bottom margin */}
        <button
          onClick={onViewLikers}
          className="mt-4 mb-4 flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-2.5 text-sm font-bold text-purple-950 active:scale-95"
        >
          <Users className="h-4 w-4" />
          Ver leitores interessados
        </button>
      </div>
    </div>
  );
}

function ListingCard({
  listing,
  preferences,
  onOpenDetail,
  likeBadge,
  passBadge,
}: {
  listing: BookListing;
  preferences: UserPreferences;
  onOpenDetail: (l: BookListing) => void;
  likeBadge: boolean;
  passBadge: boolean;
}) {
  const matchedGenres = preferences.genres.filter((g) =>
    (GENRE_CATEGORY_MAP[g] || []).includes(listing.book.category || '')
  );
  const matchedAuthor = preferences.authors.some((a) =>
    listing.book.author.toLowerCase().includes(a.trim().toLowerCase())
  );
  const isPreferred = matchedGenres.length > 0 || matchedAuthor;

  const distLabel = listing.distanceKm < 5 ? `${listing.distanceKm} km` : `~${Math.round(listing.distanceKm)} km`;
  const sameCity = listing.city === CURRENT_USER.city;
  const motoMin = Math.max(15, Math.round(listing.distanceKm * 8 + 12));

  return (
    <button
      type="button"
      onClick={() => onOpenDetail(listing)}
      className="block h-full w-full text-left active:scale-[0.99]"
      aria-label="Ver detalhes do livro"
    >
      <div className={`relative h-full w-full overflow-hidden rounded-3xl ${listing.book.coverClass} shadow-2xl ring-1 ring-purple-700/40`} style={{ borderRadius: '24px' }}>
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-black/10" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl drop-shadow-lg">{listing.book.coverEmoji}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent px-4 pb-4 pt-10">
          <h3 className="text-base font-bold leading-tight text-white drop-shadow line-clamp-2">
            {listing.book.title}
          </h3>
          <p className="mt-0.5 text-xs text-white/85 line-clamp-1">{listing.book.author}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              {listing.book.condition}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-medium text-mint-300">
              <MapPin className="h-3 w-3 shrink-0" />
              {distLabel} · {listing.city}
            </span>
            {sameCity && (
              <span className="flex items-center gap-1 text-[10px] font-medium text-mint-300">
                <Bike className="h-3 w-3 shrink-0" />
                Moto: {motoMin} min
              </span>
            )}
          </div>
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-white/90 backdrop-blur-sm">
          <Info className="h-3.5 w-3.5" />
          <span className="text-[10px] font-semibold">Toque para expandir</span>
        </div>

        {isPreferred && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-mint-400/90 px-2.5 py-1 text-purple-950 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 fill-current" />
            <span className="text-[10px] font-bold">Do seu estilo</span>
          </div>
        )}

        {likeBadge && (
          <div className="absolute right-5 top-12 rotate-12 rounded-2xl border-4 border-mint-400 px-4 py-1 text-2xl font-extrabold text-mint-400">
            GOSTEI!
          </div>
        )}
        {passBadge && (
          <div className="absolute left-5 top-12 -rotate-12 rounded-2xl border-4 border-purple-300 px-4 py-1 text-2xl font-extrabold text-purple-100">
            PASSAR
          </div>
        )}
      </div>
    </button>
  );
}
