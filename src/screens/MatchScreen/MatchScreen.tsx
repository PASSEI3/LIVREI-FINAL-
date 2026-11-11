import { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeftRight,
  Heart,
  MessageCircle,
  MapPin,
  Eye,
  Sparkles,
  Clock,
  CheckCircle2,
  Filter,
  Star,
  History,
  Loader2,
  Timer,
  Truck,
  Copy,
  Check,
  PackageCheck,
} from 'lucide-react';
import type { MatchEntry, MeetupPoint } from '@/types';
import type { ShelfLiker } from '@/data';
import { BookCover } from '@/components/BookCover/BookCover';
import { AttentionBanner } from '@/components/AttentionBanner/AttentionBanner';

interface Props {
  matches: MatchEntry[];
  meetups: Record<string, MeetupPoint>;
  likers: ShelfLiker[];
  initialSection?: Section;
  onPay: (match: MatchEntry) => void;
  onChat: (match: MatchEntry) => void;
  onOpenLiker: (liker: ShelfLiker) => void;
  onSimulatePartnerPayment: (match: MatchEntry) => void;
  onConfirmReceipt: (match: MatchEntry) => void;
}

type Section = 'likers' | 'ongoing' | 'history';

const isChatUnlocked = (m: MatchEntry) => Boolean(m.feePaidByMe && m.feePaidByPartner);

const statusBadge: Record<MatchEntry['status'], { label: string; cls: string; dot: string }> = {
  novo: { label: 'Novo!', cls: 'bg-mint-400 text-purple-950', dot: 'bg-mint-400' },
  conversando: { label: 'Conversando', cls: 'bg-purple-300 text-purple-900', dot: 'bg-purple-300' },
  finalizado: { label: 'Finalizado', cls: 'bg-neutral-700 text-neutral-300', dot: 'bg-neutral-500' },
};

const ongoingBadge = { label: 'Em andamento', cls: 'bg-mint-400/20 text-mint-300 ring-1 ring-mint-400/40' };

const sectionTabs: { id: Section; label: string; icon: typeof Eye }[] = [
  { id: 'likers', label: 'De olho na sua estante', icon: Eye },
  { id: 'ongoing', label: 'Em andamento', icon: Loader2 },
  { id: 'history', label: 'Histórico', icon: History },
];

const NOW = new Date('2026-10-27T12:00:00');
const EXPIRY_MS = 3 * 24 * 60 * 60 * 1000;

function timeRemaining(likedAt: string): { label: string; hoursLeft: number; urgent: boolean } {
  const d = new Date(likedAt);
  const elapsed = NOW.getTime() - d.getTime();
  const hoursLeft = Math.max(0, Math.floor((EXPIRY_MS - elapsed) / (60 * 60 * 1000)));
  if (hoursLeft >= 48) return { label: `Expira em ${Math.ceil(hoursLeft / 24)}d`, hoursLeft, urgent: false };
  if (hoursLeft >= 24) return { label: `Expira em ${hoursLeft}h`, hoursLeft, urgent: false };
  if (hoursLeft > 0) return { label: `Expira em ${hoursLeft}h`, hoursLeft, urgent: true };
  return { label: 'Expirado', hoursLeft: 0, urgent: true };
}

function timeAgo(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date('2026-10-27');
  const diff = Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86400000));
  if (diff === 0) return 'hoje';
  if (diff === 1) return 'ontem';
  return `${diff} dias atrás`;
}

export function MatchScreen({ matches, meetups, likers, initialSection = 'likers', onPay, onChat, onOpenLiker, onSimulatePartnerPayment, onConfirmReceipt }: Props) {
  const [section, setSection] = useState<Section>(initialSection);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  const activeLikers = useMemo(
    () => likers.filter((l) => NOW.getTime() - new Date(l.likedAt).getTime() < EXPIRY_MS),
    [likers]
  );

  const ongoingMatches = matches.filter((m) => m.status === 'novo' || m.status === 'conversando');
  const historyMatches = matches.filter((m) => m.status === 'finalizado');
  const pendingCount = matches.filter((m) => m.status === 'novo').length;
  const showBanner = !bannerDismissed && pendingCount > 0;

  const sectionContent: Record<Section, number> = {
    likers: activeLikers.length,
    ongoing: ongoingMatches.length,
    history: historyMatches.length,
  };

  return (
    <div className="h-full overflow-y-auto px-4 pb-4 no-scrollbar">
      {/* Header with gradient accent and live counters */}
      <div className="mb-3 mt-1 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-mint-400/15 ring-1 ring-mint-400/30">
          <Sparkles className="h-4 w-4 text-mint-400" />
        </div>
        <h2 className="text-lg font-bold text-purple-50">Seus matches</h2>
        <span className="ml-auto flex items-center gap-1 rounded-full bg-mint-400 px-2.5 py-0.5 text-xs font-bold text-purple-950">
          <Heart className="h-3 w-3 fill-current" />
          {matches.length}
        </span>
      </div>

      {showBanner && (
        <div className="sticky top-0 z-10 -mx-4 mb-3 bg-purple-950/80 px-4 py-1 backdrop-blur-md">
          <AttentionBanner
            onOpen={() => setSection('ongoing')}
            onDismiss={() => setBannerDismissed(true)}
          />
        </div>
      )}

      {/* Section pills — 3-tab navigation */}
      <div className="mb-5">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 no-scrollbar">
          {sectionTabs.map((tab) => {
            const active = section === tab.id;
            const Icon = tab.icon;
            const count = sectionContent[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setSection(tab.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                  active
                    ? 'bg-mint-400 text-purple-950 shadow-lg shadow-mint-400/20'
                    : 'bg-purple-900/60 text-purple-300 ring-1 ring-purple-800'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active && tab.id === 'ongoing' ? 'animate-spin' : ''}`} />
                {tab.label}
                <span className={`rounded-full px-1.5 text-[10px] ${active ? 'bg-purple-950/20' : 'bg-purple-800'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* === LIKERS SECTION === */}
      {section === 'likers' && (
        <div>
          {activeLikers.length > 0 ? (
            <>
              <div className="mb-2.5 flex items-center gap-2">
                <Eye className="h-4 w-4 text-mint-400" />
                <h3 className="text-sm font-bold text-purple-50">Leitores de olho na sua estante</h3>
                <span className="rounded-full bg-purple-800 px-2 py-0.5 text-[10px] font-bold text-purple-200">
                  {activeLikers.length}
                </span>
              </div>
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
                {activeLikers.map((liker) => {
                  const remaining = timeRemaining(liker.likedAt);
                  return (
                    <button
                      key={liker.id}
                      onClick={() => onOpenLiker(liker)}
                      className="group relative flex shrink-0 flex-col items-center gap-2 rounded-2xl bg-purple-900/60 p-3 ring-1 ring-purple-800 active:scale-95"
                    >
                      <div className="relative">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-700 text-3xl blur-[1.5px] transition group-hover:blur-[1px]">
                          {liker.avatarEmoji}
                        </div>
                        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-mint-400 ring-2 ring-purple-900">
                          <Heart className="h-3.5 w-3.5 fill-purple-950 text-purple-950" />
                        </div>
                        {liker.rating >= 4.8 && (
                          <div className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 ring-2 ring-purple-900">
                            <Star className="h-2.5 w-2.5 fill-purple-950 text-purple-950" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-semibold text-purple-100">{liker.name}</p>
                        <p className="text-[9px] text-purple-400">{liker.city.split(' - ')[0]}</p>
                      </div>
                      {/* Time-remaining badge */}
                      <span
                        className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                          remaining.urgent
                            ? 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30'
                            : 'bg-mint-400/15 text-mint-300'
                        }`}
                      >
                        <Timer className="h-2.5 w-2.5" />
                        {remaining.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Likers list detail */}
              <div className="mt-4 space-y-3">
                {activeLikers.map((liker) => {
                  const remaining = timeRemaining(liker.likedAt);
                  return (
                    <button
                      key={liker.id}
                      onClick={() => onOpenLiker(liker)}
                      className="flex w-full items-center gap-3 rounded-2xl bg-purple-900/60 p-3 ring-1 ring-purple-800 active:scale-[0.98]"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 text-2xl">
                        {liker.avatarEmoji}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="truncate text-sm font-bold text-purple-50">{liker.name}</p>
                        <p className="flex items-center gap-1.5 text-[11px] text-purple-400">
                          <MapPin className="h-3 w-3" /> {liker.city}
                          <span className="text-purple-600">·</span>
                          <Star className="h-3 w-3 text-amber-400" /> {liker.rating}
                          <span className="text-purple-600">·</span>
                          {liker.tradesCount} trocas
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span
                          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            remaining.urgent
                              ? 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30'
                              : 'bg-mint-400/15 text-mint-300'
                          }`}
                        >
                          <Timer className="h-2.5 w-2.5" />
                          {remaining.label}
                        </span>
                        <div className="flex items-center gap-1 rounded-full bg-mint-400/15 px-2.5 py-1 text-[10px] font-semibold text-mint-300">
                          <Eye className="h-3 w-3" /> Ver estante
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 animate-heart-pop text-5xl">👁️</div>
              <p className="text-purple-300">Ninguém curtiu sua estante ainda.</p>
              <p className="mt-1 text-xs text-purple-500">Cadastre mais livros para chamar atenção dos leitores!</p>
            </div>
          )}
        </div>
      )}

      {/* === ONGOING SECTION === */}
      {section === 'ongoing' && (
        <div>
          {ongoingMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 text-5xl">📭</div>
              <p className="text-purple-300">Nenhuma troca em andamento.</p>
              <p className="mt-1 text-xs text-purple-500">Dê "Gostei" nos livros do feed para começar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingMatches.map((m, i) => {
                const meetup = meetups[m.id];
                const isNew = m.status === 'novo';
                const isTrackingActive = Boolean(m.deliveryMethod === 'correios' && m.trackingCode);
                const chatUnlocked = isChatUnlocked(m);
                return (
                  <div
                    key={m.id}
                    className={`overflow-hidden rounded-3xl bg-purple-900/60 ring-1 transition-all duration-300 animate-fade-in ${
                      isNew ? 'ring-mint-400/40 shadow-lg shadow-mint-400/5' : 'ring-purple-800'
                    }`}
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {/* Header bar */}
                    <div className="flex items-center gap-2 border-b border-purple-800 px-4 py-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-mint-400/15">
                        <Heart className="h-3.5 w-3.5 fill-mint-400 text-mint-400" />
                      </div>
                      <span className="text-sm font-semibold text-purple-50">
                        Match direto
                      </span>
                      <div className="ml-auto flex items-center gap-1.5">
                        {isNew && <span className="h-2 w-2 animate-pulse rounded-full bg-mint-400" />}
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${isTrackingActive ? ongoingBadge.cls : statusBadge[m.status].cls}`}>
                          {isTrackingActive ? ongoingBadge.label : statusBadge[m.status].label}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Book exchange visual */}
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <BookCover book={m.bookFrom} className="h-28 w-20" emojiSize="text-3xl" />
                          <p className="mt-1.5 text-[10px] font-semibold text-mint-400">Você recebe</p>
                        </div>

                        <div className="flex flex-1 flex-col items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-800">
                            <ArrowLeftRight className="h-5 w-5 text-purple-300" />
                          </div>
                        </div>

                        <div className="text-center">
                          <BookCover book={m.bookTo} className="h-28 w-20" emojiSize="text-3xl" />
                          <p className="mt-1.5 text-[10px] font-semibold text-purple-300">Você envia</p>
                        </div>
                      </div>

                      {/* Partner row with time-ago badge */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-700 text-lg">
                          {m.partnerEmoji}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-purple-50">{m.partnerName}</p>
                          <p className="flex items-center gap-1 text-[11px] text-purple-400">
                            <Clock className="h-3 w-3" />
                            {timeAgo(m.createdAt)}
                            {m.partnerDistanceKm != null && (
                              <>
                                <span className="text-purple-600">·</span>
                                <MapPin className="h-3 w-3" />
                                {m.partnerDistanceKm < 5 ? `${m.partnerDistanceKm} km` : `~${Math.round(m.partnerDistanceKm)} km`}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => onChat(m)}
                            disabled={!chatUnlocked}
                            className={`flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100 ${chatUnlocked ? 'bg-mint-400 text-purple-950' : 'bg-purple-900 text-purple-600'}`}
                            aria-label="Conversar"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          {!chatUnlocked && !isTrackingActive && (
                            <span className="flex max-w-[9rem] flex-col items-end gap-1"><span className="text-right text-[10px] leading-tight text-purple-400">Chat liberado após a confirmação do pagamento</span><button type="button" onClick={() => onSimulatePartnerPayment(m)} className="text-[10px] font-semibold text-mint-400 underline underline-offset-2">Simular pagamento do outro</button></span>
                          )}
                          {isTrackingActive ? (
                            <span className="flex shrink-0 items-center gap-1 rounded-full bg-mint-400/15 px-3 py-2 text-xs font-bold text-mint-300 ring-1 ring-mint-400/30">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Troca Paga
                            </span>
                          ) : (
                            <button
                              onClick={() => onPay(m)}
                              className="rounded-full bg-mint-400 px-4 py-2 text-xs font-bold text-purple-950 shadow-lg shadow-mint-400/20 transition active:scale-95"
                            >
                              Confirmar Troca (R$ 2,00)
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Meetup info */}
                      {meetup && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-mint-400/10 px-3 py-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-mint-400" />
                          <p className="truncate text-xs text-mint-200">
                            Encontro: <span className="font-semibold">{meetup.name}</span>
                          </p>
                        </div>
                      )}

                      {/* Tracking code for Correios shipments */}
                      {m.deliveryMethod === 'correios' && m.trackingCode && (
                        <div className="mt-3 rounded-2xl bg-purple-950/60 p-3 ring-1 ring-purple-800">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 shrink-0 text-mint-400" />
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-purple-400">Código de rastreio</p>
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <p className="min-w-0 flex-1 truncate font-mono text-sm font-bold text-purple-50">{m.trackingCode}</p>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(m.trackingCode ?? '').catch(() => {});
                                setCopiedCode(m.id);
                                setTimeout(() => setCopiedCode(null), 2000);
                              }}
                              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition active:scale-95 ${
                                copiedCode === m.id
                                  ? 'bg-mint-400 text-purple-950'
                                  : 'bg-purple-800 text-purple-100 ring-1 ring-purple-700'
                              }`}
                            >
                              {copiedCode === m.id ? (
                                <>
                                  <Check className="h-3.5 w-3.5" /> Copiado!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" /> Copiar Código
                                </>
                              )}
                            </button>
                          </div>
                          {copiedCode === m.id && (
                            <p className="mt-1.5 text-[10px] font-medium text-mint-300">Código copiado!</p>
                          )}
                          <button
                            onClick={() => onConfirmReceipt(m)}
                            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-2.5 text-xs font-bold text-purple-950 active:scale-95"
                          >
                            <PackageCheck className="h-4 w-4" /> Confirmar Recebimento
                          </button>
                        </div>
                      )}

                      {/* Progress indicator */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[10px] font-medium text-purple-400">
                          <span>Progresso da troca</span>
                          <span>{isNew ? '1 de 3 etapas' : '2 de 3 etapas'}</span>
                        </div>
                        <div className="mt-1.5 flex gap-1.5">
                          <div className="h-1.5 flex-1 rounded-full bg-mint-400" />
                          <div className={`h-1.5 flex-1 rounded-full ${isNew ? 'bg-purple-700' : 'bg-mint-400'}`} />
                          <div className="h-1.5 flex-1 rounded-full bg-purple-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* === HISTORY SECTION === */}
      {section === 'history' && (
        <div>
          {historyMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-3 text-5xl">📖</div>
              <p className="text-purple-300">Nenhuma troca concluída ainda.</p>
              <p className="mt-1 text-xs text-purple-500">Suas trocas finalizadas aparecerão aqui.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyMatches.map((m, i) => (
                <div
                  key={m.id}
                  className="overflow-hidden rounded-3xl bg-purple-900/40 ring-1 ring-purple-800 animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-700">
                      <CheckCircle2 className="h-6 w-6 text-neutral-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-purple-100">{m.bookFrom.title}</p>
                      <p className="flex items-center gap-1.5 text-[11px] text-purple-400">
                        <span>Trocado com {m.partnerName}</span>
                        <span className="text-purple-600">·</span>
                        <Clock className="h-3 w-3" />
                        {timeAgo(m.createdAt)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => onChat(m)}
                        disabled={!isChatUnlocked(m)}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90 disabled:cursor-not-allowed disabled:active:scale-100 ${isChatUnlocked(m) ? 'bg-mint-400 text-purple-950' : 'bg-purple-900 text-purple-600'}`}
                        aria-label="Conversar"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      {!isChatUnlocked(m) && (
                        <span className="flex max-w-[9rem] flex-col items-end gap-1"><span className="text-right text-[10px] leading-tight text-purple-400">Chat liberado após a confirmação do pagamento</span><button type="button" onClick={() => onSimulatePartnerPayment(m)} className="text-[10px] font-semibold text-mint-400 underline underline-offset-2">Simular pagamento do outro</button></span>
                      )}
                      <span className="rounded-full bg-neutral-700 px-3 py-1.5 text-[10px] font-bold text-neutral-300">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Concluído
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === 'ongoing' && ongoingMatches.length === 0 && matches.length > 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Filter className="mb-2 h-8 w-8 text-purple-600" />
          <p className="text-sm text-purple-400">Nenhuma troca em andamento.</p>
          <button
            onClick={() => setSection('history')}
            className="mt-3 rounded-full bg-purple-800 px-4 py-2 text-xs font-semibold text-purple-200 active:scale-95"
          >
            Ver histórico
          </button>
        </div>
      )}
    </div>
  );
}
