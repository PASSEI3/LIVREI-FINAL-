import { useState, useMemo, useRef, useCallback } from 'react';
import { ScanLine, Check, Sparkles, BookPlus, Pencil, ImagePlus, Camera, Info, Coins, AlertTriangle, X, Crown, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCcw, HelpCircle, Trash2, RefreshCw, Grid3x3, Aperture } from 'lucide-react';
import type { Book, ConservationState, BookTier } from '@/types';
import { BookCover } from '@/components/BookCover/BookCover';

interface Props {
  onAdd: (book: Book) => void;
}

const SCAN_RESULTS: Omit<Book, 'condition' | 'notes'>[] = [
  { id: 's1', title: 'A Biblioteca Perdida', author: 'Susan Orlean', coverClass: 'cover-1', coverEmoji: '📚', isbn: '9788542221305', category: 'Não-ficção', tier: 'PADRÃO' },
  { id: 's2', title: 'O Poder do Hábito', author: 'Charles Duhigg', coverClass: 'cover-2', coverEmoji: '🔄', isbn: '9788539000228', category: 'Autoajuda', tier: 'PADRÃO' },
  { id: 's3', title: 'Frankenstein — Edição Comemorativa Ilustrada', author: 'Mary Shelley', coverClass: 'cover-8', coverEmoji: '🧟', isbn: '9788533300108', category: 'Clássico', tier: 'PREMIUM' },
  { id: 's4', title: 'A Revolução dos Bichos — Box Coleção Orwell', author: 'George Orwell', coverClass: 'cover-4', coverEmoji: '🐷', isbn: '9788533300085', category: 'Ficção', tier: 'PREMIUM' },
];

const CONDITIONS: ConservationState[] = ['Novo/Lacrado', 'Seminovo', 'Bom Estado', 'Marcas de Uso'];

const CATEGORIES = ['Ficção', 'Não-ficção', 'Clássico', 'Autoajuda', 'Fantasia', 'Romance', 'Suspense', 'Biografia', 'Infantil', 'Outro'];

const BASE_COINS: Record<BookTier, number> = { PADRÃO: 10, PREMIUM: 30 };
const NEW_BONUS: Record<BookTier, number> = { PADRÃO: 15, PREMIUM: 40 };

type Mode = 'idle' | 'scanning' | 'found' | 'manual';

export function ScanScreen({ onAdd }: Props) {
  const [mode, setMode] = useState<Mode>('idle');
  const [found, setFound] = useState<Book | null>(null);
  const [condition, setCondition] = useState<ConservationState>('Seminovo');
  const [notes, setNotes] = useState('');
  const [showNewWarning, setShowNewWarning] = useState(false);
  const [manualForm, setManualForm] = useState({ title: '', author: '', category: 'Ficção', isbn: '' });
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showPhotoHelp, setShowPhotoHelp] = useState(false);
  const [cameraSlot, setCameraSlot] = useState<number | null>(null);

  const detectedTier: BookTier = useMemo(() => {
    if (mode === 'found' && found?.tier) return found.tier;
    if (mode === 'manual') {
      const isbn = manualForm.isbn.trim();
      const cat = manualForm.category;
      if (isbn && ['Clássico', 'Biografia'].includes(cat)) return 'PREMIUM';
      return 'PADRÃO';
    }
    return 'PADRÃO';
  }, [mode, found, manualForm]);

  const coins = useMemo(() => {
    if (condition === 'Novo/Lacrado') return NEW_BONUS[detectedTier];
    return BASE_COINS[detectedTier];
  }, [condition, detectedTier]);

  const handleScan = () => {
    setMode('scanning');
    setFound(null);
    setTimeout(() => {
      const pick = SCAN_RESULTS[Math.floor(Math.random() * SCAN_RESULTS.length)];
      setFound({ ...pick, condition, notes: '' });
      setMode('found');
    }, 1500);
  };

  const buildBook = (): Book => ({
    id: `m-${Date.now()}`,
    title: manualForm.title,
    author: manualForm.author,
    coverClass: 'cover-1',
    coverEmoji: '📖',
    condition,
    notes: notes.trim() || undefined,
    category: manualForm.category,
    isbn: manualForm.isbn.trim() || undefined,
    tier: detectedTier,
  });

  const handleConfirm = () => {
    if (mode === 'found' && found) {
      onAdd({ ...found, condition, notes: notes.trim() || undefined });
    } else if (mode === 'manual' && manualForm.title.trim() && manualForm.author.trim()) {
      onAdd(buildBook());
    }
    reset();
  };

  const reset = () => {
    setMode('idle');
    setFound(null);
    setNotes('');
    setCondition('Seminovo');
    setShowNewWarning(false);
    setManualForm({ title: '', author: '', category: 'Ficção', isbn: '' });
    setPhotos([null, null, null]);
    setPreviewIndex(null);
    setShowPhotoHelp(false);
    setCameraSlot(null);
  };

  const handlePhotoTap = (index: number) => {
    if (photos[index]) {
      setPreviewIndex(index);
      return;
    }
    setCameraSlot(index);
  };

  const handleCapture = () => {
    if (cameraSlot === null) return;
    setPhotos((p) => p.map((ph, i) => (i === cameraSlot ? 'mock' : ph)));
    setCameraSlot(null);
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos((p) => p.map((ph, i) => (i === index ? null : ph)));
    setPreviewIndex(null);
  };

  const handlePhotoReplace = (index: number) => {
    setPhotos((p) => p.map((ph, i) => (i === index ? 'mock' : ph)));
  };

  const handleConditionChange = (c: ConservationState) => {
    setCondition(c);
    if (c === 'Novo/Lacrado') {
      setShowNewWarning(true);
    } else {
      setShowNewWarning(false);
    }
  };

  const photosReady = !!(photos[0] && photos[1]);
  const canConfirm =
    photosReady &&
    (mode === 'found' ||
      (mode === 'manual' && manualForm.title.trim().length > 1 && manualForm.author.trim().length > 1));

  return (
    <div className="flex h-full flex-col px-4 pb-4">
      <div className="relative mx-auto mt-2 w-full max-w-sm flex-1 overflow-hidden rounded-4xl bg-purple-900/60 ring-1 ring-purple-700">
        {/* IDLE — escolha inicial */}
        {mode === 'idle' && (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-3xl border-2 border-dashed border-purple-600">
              <ScanLine className="h-14 w-14 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-purple-50">Cadastrar um livro</h2>
            <p className="mt-1 text-sm text-purple-300">Escanear o ISBN preenche tudo automaticamente.</p>
            <button
              onClick={handleScan}
              className="mt-5 flex items-center gap-2 rounded-full bg-mint-400 px-6 py-3.5 font-bold text-purple-950 active:scale-95"
            >
              <ScanLine className="h-5 w-5" /> Escanear ISBN
            </button>

            <button
              onClick={() => setMode('manual')}
              className="mt-5 flex items-center gap-1.5 text-xs font-medium text-purple-400 underline underline-offset-4 active:scale-95"
            >
              <Pencil className="h-3.5 w-3.5" /> Não conseguiu escanear? Cadastre manualmente
            </button>
          </div>
        )}

        {/* SCANNING */}
        {mode === 'scanning' && (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="relative mb-6 flex h-40 w-40 items-center justify-center overflow-hidden rounded-3xl border-2 border-mint-400">
              <ScanLine className="h-14 w-14 text-mint-400" />
              <div className="absolute inset-x-0 top-0 h-1 bg-mint-400 shadow-[0_0_12px_2px] shadow-mint-400 animate-[scanline_1.5s_ease-in-out_infinite]" />
            </div>
            <p className="animate-pulse font-semibold text-mint-400">Lendo código...</p>
          </div>
        )}

        {/* FOUND (scanner) */}
        {mode === 'found' && found && (
          <div className="animate-scale-in flex h-full flex-col overflow-y-auto p-5 no-scrollbar">
            <div className="mb-3 flex items-center gap-2 text-mint-400">
              <Check className="h-5 w-5" />
              <span className="font-semibold">Livro identificado!</span>
            </div>
            <BookCover book={found} className="mx-auto aspect-[3/4] w-36" emojiSize="text-5xl" />
            <div className="mt-3 text-center">
              <h3 className="text-base font-bold text-purple-50">{found.title}</h3>
              <p className="text-sm text-purple-300">{found.author}</p>
              <p className="mt-1 text-xs text-purple-400">ISBN: {found.isbn}</p>
            </div>
            <RealPhotosSection
              photos={photos}
              onTap={handlePhotoTap}
              onRemove={handlePhotoRemove}
              onReplace={handlePhotoReplace}
              onHelp={() => setShowPhotoHelp(true)}
            />
            <TierBadge tier={detectedTier} />
            <ConditionSection condition={condition} setCondition={handleConditionChange} notes={notes} setNotes={setNotes} />
            {showNewWarning && <NewBookWarning />}
            <CoinCounter coins={coins} />
            <TransparencyBlock />
            <ActionButtons onCancel={reset} onConfirm={handleConfirm} canConfirm={canConfirm} />
          </div>
        )}

        {/* MANUAL */}
        {mode === 'manual' && (
          <div className="animate-scale-in flex h-full flex-col overflow-y-auto p-5 no-scrollbar">
            <div className="mb-4 flex items-center gap-2 text-purple-200">
              <Pencil className="h-5 w-5 text-mint-400" />
              <span className="font-semibold">Cadastro manual</span>
            </div>

            <RealPhotosSection
              photos={photos}
              onTap={handlePhotoTap}
              onRemove={handlePhotoRemove}
              onReplace={handlePhotoReplace}
              onHelp={() => setShowPhotoHelp(true)}
            />

            <ManualField label="Título do livro">
              <input
                value={manualForm.title}
                onChange={(e) => setManualForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ex: O Nome do Vento"
                className="w-full rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm font-medium text-purple-50 placeholder:text-purple-500 outline-none ring-1 ring-purple-700 transition focus:ring-2 focus:ring-mint-400"
              />
            </ManualField>

            <ManualField label="Nome do autor">
              <input
                value={manualForm.author}
                onChange={(e) => setManualForm((f) => ({ ...f, author: e.target.value }))}
                placeholder="Ex: Patrick Rothfuss"
                className="w-full rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm font-medium text-purple-50 placeholder:text-purple-500 outline-none ring-1 ring-purple-700 transition focus:ring-2 focus:ring-mint-400"
              />
            </ManualField>

            <ManualField label="ISBN (opcional)">
              <input
                value={manualForm.isbn}
                onChange={(e) => setManualForm((f) => ({ ...f, isbn: e.target.value }))}
                placeholder="Ex: 9788533300085"
                inputMode="numeric"
                className="w-full rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm font-medium text-purple-50 placeholder:text-purple-500 outline-none ring-1 ring-purple-700 transition focus:ring-2 focus:ring-mint-400"
              />
            </ManualField>

            <ManualField label="Categoria / Gênero">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setManualForm((f) => ({ ...f, category: cat }))}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      manualForm.category === cat ? 'bg-mint-400 text-purple-950' : 'bg-purple-800 text-purple-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </ManualField>

            <TierBadge tier={detectedTier} />
            <ConditionSection condition={condition} setCondition={handleConditionChange} notes={notes} setNotes={setNotes} />
            {showNewWarning && <NewBookWarning />}
            <CoinCounter coins={coins} />
            <TransparencyBlock />
            <p className="mb-3 flex items-start gap-1.5 text-[9px] leading-snug text-purple-400">
              <Info className="mt-px h-3 w-3 shrink-0 text-purple-500" />
              Somente fotos reais do seu exemplar são aceitas. Imagens baixadas da internet ou genéricas são proibidas e levam à recusa do cadastro.
            </p>
            <ActionButtons onCancel={reset} onConfirm={handleConfirm} canConfirm={canConfirm} />
          </div>
        )}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-purple-400">
        <Sparkles className="h-3.5 w-3.5 text-mint-400" /> Dados simulados para demonstração
      </p>

      {previewIndex !== null && (
        <PhotoViewer
          photos={photos}
          startIndex={previewIndex}
          onClose={() => setPreviewIndex(null)}
          onNavigate={setPreviewIndex}
        />
      )}

      {showPhotoHelp && (
        <PhotoHelpModal onClose={() => setShowPhotoHelp(false)} />
      )}

      {cameraSlot !== null && (
        <CameraCaptureView
          slot={cameraSlot}
          onClose={() => setCameraSlot(null)}
          onCapture={handleCapture}
        />
      )}

      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          50% { top: calc(100% - 4px); }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
}

function TierBadge({ tier }: { tier: BookTier }) {
  const isPremium = tier === 'PREMIUM';
  return (
    <div className="mt-3 flex justify-center">
      <div
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold ${
          isPremium
            ? 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30'
            : 'bg-purple-800/80 text-purple-200 ring-1 ring-purple-700'
        }`}
      >
        {isPremium ? (
          <>
            <Crown className="h-3.5 w-3.5" />
            PREMIUM · Edição especial ou raridade
          </>
        ) : (
          <>
            <BookPlus className="h-3.5 w-3.5" />
            PADRÃO
          </>
        )}
      </div>
    </div>
  );
}

function NewBookWarning() {
  return (
    <div className="mt-3 animate-fade-in rounded-2xl bg-amber-400/10 p-3 ring-1 ring-amber-400/30">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-xs font-medium leading-relaxed text-amber-200/90">
          <span className="font-bold">Atenção:</span> Para livros novos ou lacrados, certifique-se de que não há grifos ou avarias na capa. A comunidade fiscaliza!
        </p>
      </div>
    </div>
  );
}

function CoinCounter({ coins }: { coins: number }) {
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl bg-mint-400/10 p-5 ring-1 ring-mint-400/30">
      <p className="text-xs font-semibold uppercase tracking-wide text-mint-300">Você ganhará</p>
      <div className="mt-1.5 flex items-center gap-2">
        <Coins className="h-8 w-8 fill-mint-400 text-mint-400" />
        <span className="text-4xl font-extrabold text-mint-400 tabular-nums">{coins}</span>
        <span className="text-lg font-bold text-mint-300">Moedas</span>
      </div>
      <p className="mt-1.5 text-xs font-medium text-purple-300">ao desapegar deste livro</p>
    </div>
  );
}

function TransparencyBlock() {
  return (
    <div className="mt-3 rounded-2xl bg-purple-950/50 p-4 ring-1 ring-purple-800/60">
      <div className="flex items-start gap-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
        <div>
          <p className="text-xs font-semibold text-purple-300">Como calculamos isso?</p>
          <p className="mt-1 text-[11px] font-normal leading-relaxed text-purple-400/80">
            O LIVREI analisa o código ISBN do livro para identificar sua raridade, categoria e peso de mercado, cruzando esses dados automaticamente com o Estado de Conservação que você selecionou. Isso garante uma valorização justa e equilibrada para toda a comunidade!
          </p>
        </div>
      </div>
    </div>
  );
}

function ManualField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs font-semibold text-purple-300">{label}</label>
      {children}
    </div>
  );
}

function ConditionSection({
  condition,
  setCondition,
  notes,
  setNotes,
}: {
  condition: ConservationState;
  setCondition: (c: ConservationState) => void;
  notes: string;
  setNotes: (n: string) => void;
}) {
  return (
    <div className="mt-4">
      <label className="mb-2 block text-xs font-semibold text-purple-300">Estado de conservação</label>
      <div className="flex flex-wrap gap-2">
        {CONDITIONS.map((c) => (
          <button
            key={c}
            onClick={() => setCondition(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              condition === c ? 'bg-mint-400 text-purple-950' : 'bg-purple-800 text-purple-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <label className="mt-3 mb-1.5 block text-xs font-semibold text-purple-300">
        Observações gerais e rasuras
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="Ex: páginas amareladas, grifos, dedicatórias, capa levemente gasta..."
        className="w-full resize-none rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm text-purple-50 placeholder:text-purple-500 outline-none ring-1 ring-purple-700 transition focus:ring-2 focus:ring-mint-400"
      />
    </div>
  );
}

function ActionButtons({ onCancel, onConfirm, canConfirm }: { onCancel: () => void; onConfirm: () => void; canConfirm: boolean }) {
  return (
    <div className="mt-auto flex gap-3 pt-4">
      <button
        onClick={onCancel}
        className="flex-1 rounded-full bg-purple-800 py-3 font-semibold text-purple-200 active:scale-95"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirm}
        disabled={!canConfirm}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-mint-400 py-3 font-semibold text-purple-950 disabled:opacity-40 active:scale-95"
      >
        <BookPlus className="h-5 w-5" /> Adicionar à estante
      </button>
    </div>
  );
}

const PHOTO_SLOTS = [
  { idx: 0, label: '1. Capa e Lombada', sub: 'Frente e Lateral da estante', tip: 'Segure o livro de frente, mostrando a capa e a lombada ao mesmo tempo.', required: true },
  { idx: 1, label: '2. Laterais das Páginas', sub: 'Para checar manchas/mofo', tip: 'Com o livro fechado, fotografe de perfil destacando a borda das folhas.', required: true },
  { idx: 2, label: '3. Interior/Rasuras (Se houver)', sub: 'Se houver grifos ou assinaturas', tip: 'Abra o livro no meio e fotografe as páginas, mostrando grifos ou assinaturas.', required: false },
];

function RealPhotosSection({
  photos,
  onTap,
  onRemove,
  onReplace,
  onHelp,
}: {
  photos: (string | null)[];
  onTap: (i: number) => void;
  onRemove: (i: number) => void;
  onReplace: (i: number) => void;
  onHelp: () => void;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-xs font-semibold text-purple-300">
          Fotos Reais do Exemplar <span className="text-mint-400">(Obrigatório)</span>
        </label>
        <button
          onClick={onHelp}
          className="flex items-center gap-1 text-[10px] font-semibold text-mint-400 active:scale-95"
        >
          <HelpCircle className="h-3.5 w-3.5" /> Exemplos
        </button>
      </div>
      <div className="flex gap-2.5">
        {PHOTO_SLOTS.map((slot) => {
          const filled = !!photos[slot.idx];
          return (
            <div key={slot.idx} className="flex flex-1 flex-col items-center">
              <button
                onClick={() => onTap(slot.idx)}
                className={`relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition active:scale-95 ${
                  filled ? 'border-mint-400 bg-mint-400/10' : 'border-purple-600 bg-purple-950/40'
                }`}
              >
                {filled ? (
                  <div className="flex flex-col items-center gap-1">
                    <Check className="h-7 w-7 text-mint-400" />
                    <span className="rounded-full bg-mint-400/20 px-1.5 py-0.5 text-[7px] font-bold text-mint-300">
                      Foto enviada
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 p-3">
                    <HelpIllustration idx={slot.idx} className="h-full w-full opacity-40" />
                  </div>
                )}
                {slot.required && !filled && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-mint-400 text-[9px] font-bold text-purple-950">
                    !
                  </span>
                )}
              </button>
              {filled && (
                <div className="mt-1 flex gap-1">
                  <button
                    onClick={() => onRemove(slot.idx)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-300 ring-1 ring-red-500/40 active:scale-90"
                    aria-label="Remover foto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onReplace(slot.idx)}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-700/80 text-mint-400 ring-1 ring-purple-500 active:scale-90"
                    aria-label="Substituir foto"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </button>
                </div>
              )}
              <p className="mt-1 text-center text-[9px] font-semibold leading-tight text-purple-200">
                {slot.label}
              </p>
              <p className="text-center text-[8px] leading-tight text-purple-400">{slot.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-amber-400/10 p-2.5 ring-1 ring-amber-400/30">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
        <p className="text-[10px] font-medium leading-snug text-amber-200/90">
          Tire fotos reais do seu próprio exemplar sob boa iluminação. Fotos borradas ou baixadas da internet serão recusadas.
        </p>
      </div>
    </div>
  );
}

function PhotoWireframe({ idx, className = 'h-16 w-16 opacity-40' }: { idx: number; className?: string }) {
  if (idx === 0) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <defs>
          <linearGradient id="cover1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="spine1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5b21b6" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="pages1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="100%" stopColor="#ddd6fe" />
          </linearGradient>
        </defs>
        {/* Sombra de base */}
        <ellipse cx="34" cy="54" rx="18" ry="3" fill="#000" opacity="0.25" />
        {/* Capa frontal (plano direito em perspectiva) */}
        <polygon points="24,10 52,16 52,48 24,42" fill="url(#cover1)" stroke="#3b0764" strokeWidth="0.6" />
        {/* Lombada (plano esquerdo em perspectiva) */}
        <polygon points="12,13 24,10 24,42 12,45" fill="url(#spine1)" stroke="#3b0764" strokeWidth="0.6" />
        {/* Topo (borda das páginas) */}
        <polygon points="12,13 24,10 52,16 40,19" fill="url(#pages1)" opacity="0.85" stroke="#c4b5fd" strokeWidth="0.4" />
        {/* Linha decorativa da capa */}
        <polygon points="28,17 48,21.5 48,38 28,33.5" fill="none" stroke="#c4b5fd" strokeWidth="0.7" opacity="0.55" />
        <polygon points="30,20 46,23.5 46,35.5 30,32" fill="none" stroke="#ddd6fe" strokeWidth="0.5" opacity="0.4" />
        {/* Brilho na capa */}
        <polygon points="26,12 50,18 50,22 26,16" fill="#fff" opacity="0.12" />
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg viewBox="0 0 64 64" className={className} fill="none">
        <defs>
          <linearGradient id="cover2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="back2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b21b6" />
            <stop offset="100%" stopColor="#2e1065" />
          </linearGradient>
          <linearGradient id="pageEdge2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="35%" stopColor="#fde68a" />
            <stop offset="65%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
        </defs>
        {/* Sombra */}
        <ellipse cx="34" cy="52" rx="20" ry="3" fill="#000" opacity="0.22" />
        {/* Contracapa (atrás, inclinada) */}
        <polygon points="16,14 38,18 38,48 16,44" fill="url(#back2)" stroke="#3b0764" strokeWidth="0.6" />
        {/* Corte das páginas (frente, espessura das folhas) */}
        <polygon points="22,16 44,20 44,50 22,46" fill="url(#pageEdge2)" stroke="#d4b896" strokeWidth="0.5" />
        {/* Linhas das folhas */}
        <line x1="24" y1="18" x2="42" y2="21.4" stroke="#e6cf94" strokeWidth="0.35" opacity="0.7" />
        <line x1="24" y1="22" x2="42" y2="25.4" stroke="#e6cf94" strokeWidth="0.35" opacity="0.7" />
        <line x1="24" y1="38" x2="42" y2="41.4" stroke="#e6cf94" strokeWidth="0.35" opacity="0.6" />
        <line x1="24" y1="42" x2="42" y2="45.4" stroke="#e6cf94" strokeWidth="0.35" opacity="0.6" />
        {/* Capa frontal */}
        <polygon points="20,14 42,18 42,48 20,44" fill="url(#cover2)" stroke="#3b0764" strokeWidth="0.6" />
        {/* Brilho na capa */}
        <polygon points="22,16 40,19 40,22 22,19" fill="#fff" opacity="0.14" />
        {/* Detalhe capa */}
        <rect x="25" y="24" width="14" height="1.2" fill="#ddd6fe" opacity="0.5" transform="rotate(11 25 24)" />
        <rect x="25" y="28" width="10" height="1" fill="#ddd6fe" opacity="0.4" transform="rotate(11 25 28)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none">
      <defs>
        <linearGradient id="coverL3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="coverR3" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>
        <linearGradient id="pagesL3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="100%" stopColor="#ede4d3" />
        </linearGradient>
        <linearGradient id="pagesR3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="100%" stopColor="#ede4d3" />
        </linearGradient>
      </defs>
      {/* Sombra */}
      <ellipse cx="34" cy="54" rx="22" ry="3" fill="#000" opacity="0.2" />
      {/* Capa esquerda (inclinação) */}
      <polygon points="30,12 32,14 32,46 30,44" fill="url(#coverL3)" stroke="#3b0764" strokeWidth="0.6" />
      {/* Página esquerda */}
      <polygon points="30,14 12,16 12,48 30,46" fill="url(#pagesL3)" stroke="#d4c5a9" strokeWidth="0.5" />
      {/* Linhas de texto página esquerda */}
      <line x1="16" y1="22" x2="28" y2="21" stroke="#b8a98a" strokeWidth="0.4" opacity="0.55" />
      <line x1="16" y1="26" x2="28" y2="25" stroke="#b8a98a" strokeWidth="0.4" opacity="0.55" />
      <line x1="16" y1="30" x2="28" y2="29" stroke="#b8a98a" strokeWidth="0.4" opacity="0.5" />
      <line x1="16" y1="34" x2="26" y2="33" stroke="#b8a98a" strokeWidth="0.4" opacity="0.5" />
      <line x1="16" y1="38" x2="28" y2="37" stroke="#b8a98a" strokeWidth="0.4" opacity="0.45" />
      {/* Capa direita (inclinação) */}
      <polygon points="32,14 34,12 34,44 32,46" fill="url(#coverR3)" stroke="#3b0764" strokeWidth="0.6" />
      {/* Página direita */}
      <polygon points="32,14 50,16 50,48 32,46" fill="url(#pagesR3)" stroke="#d4c5a9" strokeWidth="0.5" />
      {/* Linhas de texto página direita */}
      <line x1="36" y1="22" x2="48" y2="23" stroke="#b8a98a" strokeWidth="0.4" opacity="0.55" />
      <line x1="36" y1="26" x2="48" y2="27" stroke="#b8a98a" strokeWidth="0.4" opacity="0.55" />
      <line x1="36" y1="30" x2="48" y2="31" stroke="#b8a98a" strokeWidth="0.4" opacity="0.5" />
      <line x1="36" y1="34" x2="46" y2="35" stroke="#b8a98a" strokeWidth="0.4" opacity="0.5" />
      <line x1="36" y1="38" x2="48" y2="39" stroke="#b8a98a" strokeWidth="0.4" opacity="0.45" />
      {/* Vinco da lombada central */}
      <line x1="32" y1="14" x2="32" y2="46" stroke="#3b0764" strokeWidth="0.6" opacity="0.5" />
      {/* Grifo amarelo sutil */}
      <rect x="16" y="29.5" width="12" height="1.5" fill="#fde68a" opacity="0.35" />
      <rect x="36" y="30" width="10" height="1.5" fill="#fde68a" opacity="0.35" />
    </svg>
  );
}

function PhotoViewer({
  photos,
  startIndex,
  onClose,
  onNavigate,
}: {
  photos: (string | null)[];
  startIndex: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotating, setRotating] = useState(0);
  const dragRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const filledIndices = useMemo(
    () => photos.map((p, i) => (p ? i : -1)).filter((i) => i >= 0),
    [photos],
  );

  const currentIndex = filledIndices.includes(startIndex)
    ? startIndex
    : filledIndices[0] ?? 0;

  const slot = PHOTO_SLOTS[currentIndex];

  const cycleZoom = useCallback(() => {
    setZoom((z) => {
      if (z >= 3) {
        setOffset({ x: 0, y: 0 });
        return 1;
      }
      return Math.min(3, +(z + 0.5).toFixed(1));
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    dragRef.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [zoom]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  }, []);

  const handlePointerUp = useCallback(() => {
    dragRef.current = false;
  }, []);

  const goPrev = useCallback(() => {
    const pos = filledIndices.indexOf(currentIndex);
    const prevIdx = filledIndices[(pos - 1 + filledIndices.length) % filledIndices.length];
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotating(0);
    onNavigate(prevIdx);
  }, [currentIndex, filledIndices, onNavigate]);

  const goNext = useCallback(() => {
    const pos = filledIndices.indexOf(currentIndex);
    const nextIdx = filledIndices[(pos + 1) % filledIndices.length];
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotating(0);
    onNavigate(nextIdx);
  }, [currentIndex, filledIndices, onNavigate]);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotating(0);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 items-center rounded-full bg-purple-800 px-2.5 text-[11px] font-bold text-mint-400">
            {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-sm font-semibold text-purple-100">{slot?.label}</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-800 text-purple-100 active:scale-90"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Image area */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={cycleZoom}
          className={`relative flex h-full w-full items-center justify-center ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
          <div
            className="flex aspect-[3/4] max-h-full max-w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-800 to-purple-950 shadow-2xl ring-1 ring-purple-600/60"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotating}deg)`,
              transition: dragRef.current ? 'none' : 'transform 0.25s ease-out',
            }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <PhotoWireframe idx={currentIndex} />
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        {filledIndices.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-purple-900/80 text-mint-400 ring-1 ring-purple-700 active:scale-90"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-purple-900/80 text-mint-400 ring-1 ring-purple-700 active:scale-90"
              aria-label="Próxima"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* Zoom controls */}
      <div className="flex shrink-0 items-center justify-center gap-4 pb-6 pt-3">
        <button
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.5).toFixed(1)))}
          disabled={zoom <= 1}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-800 text-purple-100 disabled:opacity-30 active:scale-90"
          aria-label="Diminuir zoom"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={resetView}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-800 text-mint-400 active:scale-90"
          aria-label="Restaurar"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <span className="w-12 text-center text-xs font-bold text-purple-200 tabular-nums">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(3, +(z + 0.5).toFixed(1)))}
          disabled={zoom >= 3}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-800 text-purple-100 disabled:opacity-30 active:scale-90"
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>

      <p className="shrink-0 pb-4 text-center text-[11px] font-medium text-purple-400">
        Toque duplo para alternar zoom · Arraste para mover · Deslize pelos cantos para navegar
      </p>
    </div>
  );
}

const HELP_EXAMPLES = [
  {
    idx: 0,
    title: 'Capa e Lombada',
    do: ['Boa iluminação natural', 'Livro centralizado', 'Capa e lombada visíveis'],
    dont: ['Foto escura', 'Capa cortada', 'Reflexos na capa'],
  },
  {
    idx: 1,
    title: 'Laterais das Páginas',
    do: ['Livro fechado de perfil', 'Borda das folhas nítida', 'Fundo neutro'],
    dont: ['Livro aberto', 'Foto distante', 'Sombra sobre as folhas'],
  },
  {
    idx: 2,
    title: 'Interior e Rasuras',
    do: ['Livro aberto no meio', 'Grifos visíveis', 'Página plana e legível'],
    dont: ['Página amassada', 'Foto torta', 'Texto ilegível'],
  },
];

function PhotoHelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in sm:items-center" onClick={onClose}>
      <div
        className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-4xl bg-gradient-to-b from-purple-900 to-purple-950 ring-1 ring-purple-700 sm:rounded-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-mint-400" />
            <h3 className="text-sm font-bold text-purple-50">Como tirar fotos perfeitas</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-800 text-purple-200 active:scale-90"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 no-scrollbar">
          <p className="mb-4 text-[11px] font-medium leading-snug text-purple-300">
            Veja exemplos do ângulo correto para cada foto. As miniaturas mostram exatamente o que esperar.
          </p>

          <div className="flex flex-col gap-4">
            {HELP_EXAMPLES.map((ex) => (
              <div key={ex.idx} className="rounded-2xl bg-purple-800/50 p-3 ring-1 ring-purple-700/60">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint-400 text-[10px] font-bold text-purple-950">
                    {ex.idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-purple-50">{ex.title}</h4>
                </div>

                {/* Miniatura exemplo */}
                <div className="mb-2.5 flex justify-center">
                  <div className="flex aspect-square w-28 items-center justify-center overflow-hidden rounded-xl bg-purple-950/60 ring-1 ring-purple-600/60">
                    <HelpIllustration idx={ex.idx} />
                  </div>
                </div>

                {/* Do / Dont */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-mint-400/10 p-2 ring-1 ring-mint-400/20">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-mint-400">Faça</p>
                    <ul className="flex flex-col gap-0.5">
                      {ex.do.map((d) => (
                        <li key={d} className="flex items-start gap-1 text-[9px] font-medium leading-tight text-mint-200">
                          <Check className="mt-0.5 h-2.5 w-2.5 shrink-0 text-mint-400" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-2 ring-1 ring-red-500/20">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-red-300">Evite</p>
                    <ul className="flex flex-col gap-0.5">
                      {ex.dont.map((d) => (
                        <li key={d} className="flex items-start gap-1 text-[9px] font-medium leading-tight text-red-200/90">
                          <X className="mt-0.5 h-2.5 w-2.5 shrink-0 text-red-400" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-400/10 p-2.5 ring-1 ring-amber-400/30">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            <p className="text-[10px] font-medium leading-snug text-amber-200/90">
              Fotos bem iluminadas e nítidas ajudam a comprovar a qualidade do seu exemplar e aceleram a aprovação.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 pb-4 pt-2">
          <button
            onClick={onClose}
            className="w-full rounded-full bg-mint-400 py-3 text-sm font-bold text-purple-950 active:scale-95"
          >
            Entendi, vou tirar as fotos
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpIllustration({ idx, className = 'h-24 w-24 opacity-60' }: { idx: number; className?: string }) {
  if (idx === 0) {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <defs>
          <linearGradient id="hc1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="45%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="hs1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="hp1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f3ff" />
            <stop offset="100%" stopColor="#c7d2fe" />
          </linearGradient>
        </defs>
        {/* Sombra */}
        <ellipse cx="54" cy="86" rx="28" ry="4" fill="#000" opacity="0.3" />
        {/* Capa frontal (perspectiva diagonal) */}
        <polygon points="40,14 82,22 82,78 40,70" fill="url(#hc1)" stroke="#0c1a3a" strokeWidth="0.8" />
        {/* Lombada (plano esquerdo) */}
        <polygon points="18,19 40,14 40,70 18,75" fill="url(#hs1)" stroke="#0c1a3a" strokeWidth="0.8" />
        {/* Topo (borda das páginas) */}
        <polygon points="18,19 40,14 82,22 60,27" fill="url(#hp1)" opacity="0.9" stroke="#a5b4fc" strokeWidth="0.5" />
        {/* Linhas douradas decorativas na capa */}
        <polygon points="46,22 76,28.5 76,30.5 46,24" fill="#fbbf24" opacity="0.8" />
        <polygon points="46,60 76,66.5 76,68.5 46,62" fill="#fbbf24" opacity="0.8" />
        {/* Título dourado */}
        <rect x="49" y="30" width="24" height="2.5" fill="#fbbf24" opacity="0.9" />
        <rect x="49" y="36" width="18" height="1.5" fill="#fbbf24" opacity="0.7" />
        <rect x="49" y="41" width="21" height="1.5" fill="#fbbf24" opacity="0.7" />
        <rect x="49" y="46" width="16" height="1.5" fill="#fbbf24" opacity="0.6" />
        {/* Lombada dourada */}
        <rect x="21" y="26" width="16" height="1.5" fill="#fbbf24" opacity="0.7" transform="rotate(-14 21 26)" />
        <rect x="21" y="55" width="16" height="1.5" fill="#fbbf24" opacity="0.7" transform="rotate(-14 21 55)" />
        {/* Brilho na capa */}
        <polygon points="42,16 80,24 80,30 42,22" fill="#fff" opacity="0.1" />
      </svg>
    );
  }
  if (idx === 1) {
    return (
      <svg viewBox="0 0 100 100" className={className} fill="none">
        <defs>
          <linearGradient id="hc2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="hb2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="hpe2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="30%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id="htop2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        {/* Sombra */}
        <ellipse cx="54" cy="84" rx="32" ry="4.5" fill="#000" opacity="0.28" />
        {/* Contracapa (atrás, deitado) */}
        <polygon points="22,20 72,28 72,70 22,62" fill="url(#hb2)" stroke="#0c1a3a" strokeWidth="0.8" />
        {/* Corte das páginas (frente - bloco de folhas brancas alinhadas) */}
        <polygon points="30,26 80,34 80,76 30,68" fill="url(#hpe2)" stroke="#d4b896" strokeWidth="0.6" />
        {/* Topo das páginas (borda superior branca) */}
        <polygon points="22,20 72,28 80,34 30,26" fill="url(#htop2)" opacity="0.85" stroke="#cbd5e1" strokeWidth="0.5" />
        {/* Linhas das folhas individuais */}
        <line x1="33" y1="32" x2="77" y2="39.5" stroke="#e6cf94" strokeWidth="0.4" opacity="0.7" />
        <line x1="33" y1="36" x2="77" y2="43.5" stroke="#e6cf94" strokeWidth="0.4" opacity="0.65" />
        <line x1="33" y1="40" x2="77" y2="47.5" stroke="#e6cf94" strokeWidth="0.4" opacity="0.6" />
        <line x1="33" y1="56" x2="77" y2="63.5" stroke="#e6cf94" strokeWidth="0.4" opacity="0.6" />
        <line x1="33" y1="60" x2="77" y2="67.5" stroke="#e6cf94" strokeWidth="0.4" opacity="0.55" />
        <line x1="33" y1="64" x2="77" y2="71.5" stroke="#e6cf94" strokeWidth="0.4" opacity="0.5" />
        {/* Capa frontal (azul-escura com dourados) */}
        <polygon points="26,20 76,28 76,70 26,62" fill="url(#hc2)" stroke="#0c1a3a" strokeWidth="0.8" />
        {/* Brilho na capa */}
        <polygon points="28,22 74,29 74,26 28,19" fill="#fff" opacity="0.12" />
        {/* Detalhes dourados na capa */}
        <rect x="32" y="32" width="36" height="2" fill="#fbbf24" opacity="0.8" transform="rotate(7 32 32)" />
        <rect x="32" y="38" width="28" height="1.5" fill="#fbbf24" opacity="0.7" transform="rotate(7 32 38)" />
        <rect x="32" y="43" width="32" height="1.5" fill="#fbbf24" opacity="0.7" transform="rotate(7 32 43)" />
        <rect x="32" y="50" width="24" height="1.5" fill="#fbbf24" opacity="0.6" transform="rotate(7 32 50)" />
        {/* Borda inferior dourada */}
        <polygon points="28,58 76,65 76,67 28,60" fill="#fbbf24" opacity="0.7" />
      </svg>
    );
  }
  return <PhotoWireframe idx={idx} className={className} />;
}

const GRID_LAYOUTS = [
  { id: 'none', label: 'Sem grade' },
  { id: 'rule3', label: 'Regra dos terços' },
  { id: 'grid', label: 'Grade 3x3' },
  { id: 'frame', label: 'Moldura do livro' },
];

function CameraCaptureView({
  slot,
  onClose,
  onCapture,
}: {
  slot: number;
  onClose: () => void;
  onCapture: () => void;
}) {
  const [gridMode, setGridMode] = useState(0);
  const [flash, setFlash] = useState(false);
  const slotInfo = PHOTO_SLOTS[slot];

  const handleCapture = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      onCapture();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black animate-fade-in">
      {/* Simulated camera viewport */}
      <div className="relative flex-1 overflow-hidden bg-gradient-to-b from-purple-950 via-purple-900 to-black">
        {/* Faux camera background - dark with subtle texture */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(52,211,153,0.08) 0%, transparent 50%)' }} />

        {/* Alignment grid overlay */}
        {GRID_LAYOUTS[gridMode].id !== 'none' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative aspect-[3/4] h-[85%] max-h-full">
              {GRID_LAYOUTS[gridMode].id === 'rule3' && (
                <svg className="absolute inset-0 h-full w-full" fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth="0.8">
                  <line x1="33.33%" y1="0" x2="33.33%" y2="100%" />
                  <line x1="66.66%" y1="0" x2="66.66%" y2="100%" />
                  <line x1="0" y1="33.33%" x2="100%" y2="33.33%" />
                  <line x1="0" y1="66.66%" x2="100%" y2="66.66%" />
                </svg>
              )}
              {GRID_LAYOUTS[gridMode].id === 'grid' && (
                <svg className="absolute inset-0 h-full w-full" fill="none" stroke="rgba(52,211,153,0.4)" strokeWidth="0.6">
                  {[...Array(4)].map((_, i) => (
                    <line key={`v${i}`} x1={`${(i + 1) * 20}%`} y1="0" x2={`${(i + 1) * 20}%`} y2="100%" />
                  ))}
                  {[...Array(4)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={`${(i + 1) * 20}%`} x2="100%" y2={`${(i + 1) * 20}%`} />
                  ))}
                </svg>
              )}
              {GRID_LAYOUTS[gridMode].id === 'frame' && (
                <div className="absolute inset-0 rounded-lg border-2 border-dashed border-mint-400/60">
                  {/* Corner brackets */}
                  <div className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-mint-400" />
                  <div className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-mint-400" />
                  <div className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-mint-400" />
                  <div className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-mint-400" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Guide wireframe hint - subtle book silhouette in center */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="opacity-15">
            <HelpIllustration idx={slot} />
          </div>
        </div>

        {/* Capture flash animation */}
        {flash && <div className="absolute inset-0 animate-[captureFlash_0.3s_ease-out] bg-white" />}

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pb-2 pt-4">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm active:scale-90"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-sm">
            <Aperture className="h-4 w-4 text-mint-400" />
            <span className="text-xs font-bold text-white">{slotInfo.label}</span>
          </div>
          <div className="h-10 w-10" />
        </div>

        {/* Instruction strip */}
        <div className="absolute inset-x-4 top-16">
          <div className="rounded-xl bg-black/50 px-3 py-2 backdrop-blur-sm">
            <p className="text-center text-[11px] font-medium leading-snug text-mint-200">
              {slotInfo.tip}
            </p>
          </div>
        </div>

        {/* Grid mode selector */}
        <div className="absolute inset-x-0 bottom-28 flex justify-center">
          <div className="flex items-center gap-1 rounded-full bg-black/50 p-1 backdrop-blur-sm">
            {GRID_LAYOUTS.map((g, i) => (
              <button
                key={g.id}
                onClick={() => setGridMode(i)}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition ${
                  gridMode === i ? 'bg-mint-400 text-purple-950' : 'text-white/70'
                }`}
              >
                {g.id === 'none' && <X className="h-3 w-3" />}
                {g.id === 'rule3' && <Grid3x3 className="h-3 w-3" />}
                {g.id === 'grid' && <Grid3x3 className="h-3 w-3" />}
                {g.id === 'frame' && <Aperture className="h-3 w-3" />}
                <span className="hidden sm:inline">{g.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom capture bar */}
      <div className="flex shrink-0 items-center justify-between bg-black px-8 pb-8 pt-5">
        {/* Gallery thumbnail */}
        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-800/80 ring-1 ring-purple-600 active:scale-90" aria-label="Galeria">
          <ImagePlus className="h-5 w-5 text-purple-200" />
        </button>

        {/* Shutter button */}
        <button
          onClick={handleCapture}
          className="relative flex h-18 w-18 items-center justify-center active:scale-90"
          aria-label="Capturar"
        >
          <span className="absolute inset-0 rounded-full bg-white/20" />
          <span className="absolute inset-1.5 rounded-full bg-white/30" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-mint-400">
              <Camera className="h-6 w-6 text-purple-950" />
            </span>
          </span>
        </button>

        {/* Grid toggle quick */}
        <button
          onClick={() => setGridMode((m) => (m + 1) % GRID_LAYOUTS.length)}
          className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 active:scale-90 ${gridMode === 0 ? 'bg-purple-800/80 text-purple-300 ring-purple-600' : 'bg-mint-400/20 text-mint-400 ring-mint-400/50'}`}
          aria-label="Alternar grade"
        >
          <Grid3x3 className="h-5 w-5" />
        </button>
      </div>

      <style>{`
        @keyframes captureFlash {
          0% { opacity: 0; }
          30% { opacity: 0.9; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
