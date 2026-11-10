import { useState } from 'react';
import { Search, MapPin, X, SlidersHorizontal, Bell, CheckCircle2, ShoppingCart } from 'lucide-react';
import type { BookListing, ConservationState, UserPreferences } from '@/types';
import { BookCover } from '@/components/BookCover/BookCover';
import { FilterBottomSheet, defaultFilters, type FilterState } from '@/components/FilterBottomSheet/FilterBottomSheet';

interface Props {
  listings: BookListing[];
  preferences: UserPreferences;
}

const conditionColor: Record<string, string> = {
  'Novo/Lacrado': 'bg-mint-400 text-purple-950',
  'Seminovo': 'bg-mint-300 text-purple-950',
  'Bom Estado': 'bg-purple-300 text-purple-900',
  'Marcas de Uso': 'bg-purple-200 text-purple-900',
};

const GENRE_MAP: Record<string, string> = {
  'Ficção': 'Ficção',
  'Desenvolvimento Pessoal': 'Autoajuda',
  'Psicologia': 'Não-ficção',
  'Romance': 'Romance',
  'Didáticos': 'Infantil',
  'Clássico': 'Clássico',
  'Suspense': 'Suspense',
  'Fantasia': 'Fantasia',
};

export function SearchScreen({ listings, preferences }: Props) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [alertActivated, setAlertActivated] = useState(false);

  const filtered = listings.filter((l) => {
    const q = query.trim().toLowerCase();
    if (q && !(l.book.title.toLowerCase().includes(q) || l.book.author.toLowerCase().includes(q))) return false;

    if (filters.maxDistance !== 0 && l.distanceKm > filters.maxDistance) return false;

    if (filters.state) {
      const stateFromCity = l.city.split(' - ')[1] || '';
      if (stateFromCity !== filters.state) return false;
    }

    if (filters.city) {
      const cityFromListing = l.city.split(' - ')[0] || '';
      if (cityFromListing !== filters.city) return false;
    }

    if (filters.genres.length > 0) {
      const bookCategory = l.book.category || 'Ficção';
      const matches = filters.genres.some((g) => GENRE_MAP[g] === bookCategory);
      if (!matches) return false;
    }

    if (filters.author && !l.book.author.toLowerCase().includes(filters.author.trim().toLowerCase())) return false;

    if (filters.conditions.length > 0 && !filters.conditions.includes(l.book.condition)) return false;

    // Shipping: "local" = same city, "courier" = same city (simulated)
    if (filters.shipping.length > 0) {
      const isLocal = l.distanceKm < 10;
      const matchesLocal = filters.shipping.includes('local') && isLocal;
      const matchesCourier = filters.shipping.includes('courier') && isLocal;
      if (!matchesLocal && !matchesCourier) return false;
    }

    return true;
  });

  const activeFilterCount =
    (filters.maxDistance !== 0 ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.city ? 1 : 0) +
    filters.genres.length +
    (filters.author ? 1 : 0) +
    filters.conditions.length +
    filters.shipping.length;

  const hasSearched = query.trim().length > 0 || activeFilterCount > 0;
  const showEmpty = filtered.length === 0 && hasSearched;

  const handleAlert = () => {
    setAlertActivated(true);
    setTimeout(() => setAlertActivated(false), 5000);
  };

  return (
    <div className="flex h-full flex-col px-4 pb-4">
      <div className="sticky top-0 z-10 -mx-4 bg-purple-950/90 px-4 pb-3 pt-1 glass">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título ou autor..."
              className="w-full rounded-2xl bg-purple-900 py-3.5 pl-12 pr-10 text-purple-50 placeholder:text-purple-400 outline-none ring-1 ring-purple-700 focus:ring-mint-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400"
                aria-label="Limpar"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className={`relative flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl ring-1 transition active:scale-90 ${
              activeFilterCount > 0
                ? 'bg-mint-400 text-purple-950 ring-mint-300'
                : 'bg-purple-900 text-mint-400 ring-purple-700'
            }`}
            aria-label="Filtros"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-mint-400 px-1 text-[10px] font-bold text-purple-950 ring-2 ring-purple-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 flex-1 space-y-3 overflow-y-auto no-scrollbar">
        {showEmpty ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 text-5xl">🔍</div>
            <p className="text-purple-300">
              {query || activeFilterCount > 0 ? 'Nenhum livro encontrado com esses filtros' : 'Nenhum livro encontrado'}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters(defaultFilters)}
                className="mt-4 text-sm font-semibold text-mint-400 underline underline-offset-2 active:scale-95"
              >
                Limpar filtros
              </button>
            )}

            {/* Amazon affiliate card */}
            <div className="mt-6 w-full rounded-2xl bg-purple-900/60 p-4 ring-1 ring-purple-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-amber-400" />
                <p className="text-sm font-bold text-purple-50">Comprar novo</p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-purple-400">
                Enquanto ninguém desapega deste título, você pode encontrá-lo novo na Amazon. O LIVREI recebe uma pequena comissão que ajuda a manter a plataforma.
              </p>
              <button
                onClick={() => {}}
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-amber-400/90 px-4 py-2.5 text-xs font-bold text-purple-950 active:scale-95"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Ver na Amazon
              </button>
            </div>

            {/* "Me avise quando alguém desapegar" button */}
            {alertActivated ? (
              <div className="mt-3 w-full animate-fade-in rounded-2xl bg-mint-400/15 p-4 ring-1 ring-mint-400/30">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-mint-400" />
                  <p className="text-left text-xs font-semibold leading-relaxed text-mint-300">
                    Alerta ativado! Nós te notificaremos assim que este título entrar na plataforma ou se houver recomendações baseadas no seu Estilo Literário.
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAlert}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-purple-800 px-4 py-3 text-sm font-bold text-purple-100 ring-1 ring-purple-700 active:scale-95"
              >
                <Bell className="h-4 w-4 text-mint-400" />
                Me avise quando alguém desapegar deste livro
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 text-5xl">📚</div>
            <p className="text-purple-300">Busque por um livro para trocar</p>
            <p className="mt-1 text-xs text-purple-500">Digite um título ou autor acima</p>
          </div>
        ) : (
          <>
            {activeFilterCount > 0 && (
              <p className="text-xs font-medium text-purple-400">
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
              </p>
            )}
            {filtered.map((l) => (
              <div key={l.id} className="flex gap-3 rounded-3xl bg-purple-900/60 p-3 ring-1 ring-purple-800 active:scale-[0.98]">
                <BookCover book={l.book} className="h-24 w-16 shrink-0" emojiSize="text-2xl" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate text-sm font-bold text-purple-50">{l.book.title}</h3>
                  <p className="truncate text-xs text-purple-300">{l.book.author}</p>
                  <span className={`mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold ${conditionColor[l.book.condition] || 'bg-purple-800 text-purple-100'}`}>
                    {l.book.condition}
                  </span>
                  <div className="mt-auto flex items-center gap-1.5 text-xs text-purple-300">
                    <MapPin className="h-3.5 w-3.5 text-mint-400" />
                    <span className="truncate">{l.city}</span>
                    <span className="ml-auto font-semibold text-mint-400">{l.distanceKm} km</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showFilters && (
        <FilterBottomSheet
          filters={filters}
          onApply={(f) => {
            setFilters(f);
            setShowFilters(false);
          }}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
