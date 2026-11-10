import { useState, useEffect } from 'react';
import { X, SlidersHorizontal, MapPin, Tag, User, Truck, Handshake, Zap, Check } from 'lucide-react';
import type { ConservationState } from '@/types';

export interface FilterState {
  maxDistance: number; // 0 = Nacional
  state: string; // '' = todos
  city: string; // '' = todos
  genres: string[];
  author: string;
  conditions: ConservationState[];
  shipping: ('local' | 'courier')[];
}

export const defaultFilters: FilterState = {
  maxDistance: 0,
  state: '',
  city: '',
  genres: [],
  author: '',
  conditions: [],
  shipping: [],
};

interface Props {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}

const DISTANCE_OPTIONS = [
  { label: 'Até 5 km', value: 5 },
  { label: 'Até 20 km', value: 20 },
  { label: 'Até 50 km', value: 50 },
  { label: 'Nacional', value: 0 },
];

const STATES = ['SP', 'RJ', 'PA', 'MA', 'MG', 'RS', 'BA', 'PR', 'CE', 'PE'];

const CITIES_BY_STATE: Record<string, string[]> = {
  SP: ['São Paulo', 'Guarulhos', 'Osasco', 'Campinas', 'Santos'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis'],
  PA: ['Belém', 'Ananindeua', 'Santarém'],
  MA: ['São Luís', 'Imperatriz', 'Caxias'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Pelotas'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'],
  PR: ['Curitiba', 'Londrina', 'Maringá'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
  PE: ['Recife', 'Jaboatão', 'Olinda'],
};

const GENRES = ['Ficção', 'Desenvolvimento Pessoal', 'Psicologia', 'Romance', 'Didáticos', 'Clássico', 'Suspense', 'Fantasia'];
const CONDITIONS: ConservationState[] = ['Novo/Lacrado', 'Seminovo', 'Bom Estado', 'Marcas de Uso'];

export function FilterBottomSheet({ filters, onApply, onClose }: Props) {
  const [local, setLocal] = useState<FilterState>(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const toggleGenre = (g: string) => {
    setLocal((f) => ({
      ...f,
      genres: f.genres.includes(g) ? f.genres.filter((x) => x !== g) : [...f.genres, g],
    }));
  };

  const toggleCondition = (c: ConservationState) => {
    setLocal((f) => ({
      ...f,
      conditions: f.conditions.includes(c) ? f.conditions.filter((x) => x !== c) : [...f.conditions, c],
    }));
  };

  const toggleShipping = (s: 'local' | 'courier') => {
    setLocal((f) => ({
      ...f,
      shipping: f.shipping.includes(s) ? f.shipping.filter((x) => x !== s) : [...f.shipping, s],
    }));
  };

  const activeCount =
    (local.maxDistance !== 0 ? 1 : 0) +
    (local.state ? 1 : 0) +
    (local.city ? 1 : 0) +
    local.genres.length +
    (local.author ? 1 : 0) +
    local.conditions.length +
    local.shipping.length;

  const reset = () => setLocal(defaultFilters);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-purple-950/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="animate-slide-up flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-4xl bg-purple-900 ring-1 ring-purple-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3">
          <div className="h-1.5 w-10 rounded-full bg-purple-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800 px-5 py-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-purple-50">
            <SlidersHorizontal className="h-4 w-4 text-mint-400" /> Filtros
            {activeCount > 0 && (
              <span className="rounded-full bg-mint-400 px-2 py-0.5 text-[10px] font-bold text-purple-950">{activeCount}</span>
            )}
          </h2>
          <div className="flex items-center gap-3">
            <button onClick={reset} className="text-xs font-medium text-purple-400 underline underline-offset-2 active:scale-95">
              Limpar
            </button>
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-800 text-purple-200 active:scale-90" aria-label="Fechar">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 no-scrollbar">
          {/* LOCALIZAÇÃO */}
          <Section icon={MapPin} title="Localização">
            <SubLabel>Distância máxima</SubLabel>
            <div className="flex flex-wrap gap-2">
              {DISTANCE_OPTIONS.map((d) => (
                <Chip key={d.value} active={local.maxDistance === d.value} onClick={() => setLocal((f) => ({ ...f, maxDistance: d.value }))}>
                  {d.label}
                </Chip>
              ))}
            </div>

            <SubLabel className="mt-4">Estado (UF)</SubLabel>
            <select
              value={local.state}
              onChange={(e) => setLocal((f) => ({ ...f, state: e.target.value, city: '' }))}
              className="w-full rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm font-medium text-purple-50 outline-none ring-1 ring-purple-700 focus:ring-2 focus:ring-mint-400"
            >
              <option value="">Todos os estados</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <SubLabel className="mt-3">Cidade</SubLabel>
            <select
              value={local.city}
              onChange={(e) => setLocal((f) => ({ ...f, city: e.target.value }))}
              disabled={!local.state}
              className="w-full rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm font-medium text-purple-50 outline-none ring-1 ring-purple-700 focus:ring-2 focus:ring-mint-400 disabled:opacity-40"
            >
              <option value="">Todas as cidades</option>
              {local.state &&
                (CITIES_BY_STATE[local.state] || []).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
            </select>
            {!local.state && (
              <p className="mt-1.5 text-[10px] text-purple-500">Selecione um estado primeiro</p>
            )}
          </Section>

          {/* SOBRE O LIVRO */}
          <Section icon={Tag} title="Sobre o livro">
            <SubLabel>Gênero / Categoria</SubLabel>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <Chip key={g} active={local.genres.includes(g)} onClick={() => toggleGenre(g)}>
                  {g}
                </Chip>
              ))}
            </div>

            <SubLabel className="mt-4">
              <span className="flex items-center gap-1.5">
                <User className="h-3 w-3 text-purple-400" /> Autor específico
              </span>
            </SubLabel>
            <input
              value={local.author}
              onChange={(e) => setLocal((f) => ({ ...f, author: e.target.value }))}
              placeholder="Ex: George Orwell"
              className="w-full rounded-xl bg-purple-950/60 px-3 py-2.5 text-sm font-medium text-purple-50 placeholder:text-purple-500 outline-none ring-1 ring-purple-700 focus:ring-2 focus:ring-mint-400"
            />

            <SubLabel className="mt-4">Estado de conservação</SubLabel>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map((c) => (
                <Chip key={c} active={local.conditions.includes(c)} onClick={() => toggleCondition(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Section>

          {/* LOGÍSTICA DE ENTREGA */}
          <Section icon={Truck} title="Logística de entrega" last>
            <SubLabel>Tipo de envio</SubLabel>
            <div className="space-y-2">
              <ShippingOption
                icon={Handshake}
                label="Retirada em Mãos (Troca Presencial)"
                active={local.shipping.includes('local')}
                onClick={() => toggleShipping('local')}
              />
              <ShippingOption
                icon={Zap}
                label="Envio Rápido (Rede Uber)"
                active={local.shipping.includes('courier')}
                onClick={() => toggleShipping('courier')}
              />
            </div>
          </Section>
        </div>

        {/* Footer — Aplicar */}
        <div className="border-t border-purple-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            onClick={() => onApply(local)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-4 font-bold text-purple-950 active:scale-95"
          >
            <Check className="h-5 w-5" /> Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, last }: { icon: typeof MapPin; title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={last ? '' : 'mb-5 border-b border-purple-800/60 pb-5'}>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-800">
          <Icon className="h-4 w-4 text-mint-400" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wide text-purple-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function SubLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`mb-2 text-[11px] font-semibold text-purple-400 ${className}`}>{children}</p>;
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 ${
        active ? 'bg-mint-400 text-purple-950 ring-1 ring-mint-300' : 'bg-purple-800 text-purple-200 ring-1 ring-purple-700'
      }`}
    >
      {children}
    </button>
  );
}

function ShippingOption({ icon: Icon, label, active, onClick }: { icon: typeof Handshake; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left ring-1 transition active:scale-[0.98] ${
        active ? 'bg-mint-400/15 ring-mint-400' : 'bg-purple-800/50 ring-purple-700'
      }`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-950">
        <Icon className={`h-4.5 w-4.5 ${active ? 'text-mint-400' : 'text-purple-200'}`} />
      </div>
      <span className="flex-1 text-sm font-medium text-purple-100">{label}</span>
      <div className={`h-5 w-5 shrink-0 rounded-md border-2 ${active ? 'border-mint-400 bg-mint-400' : 'border-purple-500'}`}>
        {active && <Check className="h-3.5 w-3.5 text-purple-950" />}
      </div>
    </button>
  );
}
