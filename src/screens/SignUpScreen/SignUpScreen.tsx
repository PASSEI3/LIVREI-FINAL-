import { useState } from 'react';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Mail,
  Lock,
  IdCard,
  Phone,
  MapPin,
  Shield,
  Eye,
  EyeOff,
  Building2,
  Navigation,
  BookHeart,
  Plus,
  Tag,
} from 'lucide-react';
import type { UserPreferences, LiteraryGenre } from '@/types';

interface Props {
  onComplete: (prefs: UserPreferences) => void;
  onSkip?: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  portariaOk: boolean;
  reference: string;
  acceptedTerms: boolean;
}

const empty: FormData = {
  name: '',
  email: '',
  password: '',
  cpf: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  district: '',
  city: '',
  state: '',
  portariaOk: false,
  reference: '',
  acceptedTerms: false,
};

const GENRES: { id: LiteraryGenre; emoji: string }[] = [
  { id: 'Ficção/Fantasia', emoji: '🐉' },
  { id: 'Desenvolvimento Pessoal', emoji: '🌱' },
  { id: 'Romance', emoji: '❤️' },
  { id: 'Suspense/Terror', emoji: '🕯️' },
  { id: 'Biografias', emoji: '👤' },
  { id: 'Acadêmicos', emoji: '🎓' },
];

const maskCPF = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
const maskPhone = (v: string) => v.replace(/\D/g, '').slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
const maskCEP = (v: string) => v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');

export function SignUpScreen({ onComplete, onSkip }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    setError('');
  };

  const steps = ['Conta', 'Identidade', 'Endereço', 'Estilo', 'Aceite'];

  const validateStep = (): boolean => {
    setError('');
    if (step === 0) {
      if (!data.name.trim() || data.name.trim().length < 3) { setError('Digite seu nome completo'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setError('E-mail inválido'); return false; }
      if (data.password.length < 6) { setError('A senha deve ter ao menos 6 caracteres'); return false; }
    }
    if (step === 1) {
      if (data.cpf.replace(/\D/g, '').length !== 11) { setError('CPF incompleto'); return false; }
      if (data.phone.replace(/\D/g, '').length < 10) { setError('Celular com DDD incompleto'); return false; }
    }
    if (step === 2) {
      if (data.cep.replace(/\D/g, '').length !== 8) { setError('CEP incompleto'); return false; }
      if (!data.street.trim() || !data.number.trim() || !data.district.trim() || !data.city.trim() || !data.state.trim()) {
        setError('Preencha todos os campos de endereço'); return false;
      }
    }
    if (step === 3) {
      if (selectedGenres.length === 0 && authors.length === 0) {
        setError('Selecione ao menos um gênero ou autor favorito'); return false;
      }
    }
    if (step === 4) {
      if (!data.acceptedTerms) { setError('Você precisa aceitar os Termos para continuar'); return false; }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step < 4) setStep((s) => s + 1);
    else onComplete({ genres: selectedGenres, authors });
  };

  const back = () => {
    setError('');
    if (step > 0) setStep((s) => s - 1);
  };

  const [selectedGenres, setSelectedGenres] = useState<LiteraryGenre[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');

  const toggleGenre = (g: LiteraryGenre) => {
    setSelectedGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
    setError('');
  };

  const addAuthor = () => {
    const val = authorInput.trim();
    if (!val) return;
    if (authors.length >= 3) return;
    if (authors.some((a) => a.toLowerCase() === val.toLowerCase())) return;
    setAuthors((prev) => [...prev, val]);
    setAuthorInput('');
  };

  const removeAuthor = (a: string) => {
    setAuthors((prev) => prev.filter((x) => x !== a));
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-950">
      {/* Header com progresso */}
      <div className="px-5 pt-5 pb-3">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-400 text-sm font-black text-purple-950">L</div>
            <span className="text-sm font-bold text-purple-50">LIVREI</span>
          </div>
          {onSkip && step === 0 && (
            <button onClick={onSkip} className="text-xs font-medium text-purple-400 active:scale-90">Pular</button>
          )}
        </div>

        {/* Barra de progresso */}
        <div className="flex items-center gap-1.5">
          {steps.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition ${i <= step ? 'bg-mint-400' : 'bg-purple-800'}`} />
              <p className={`mt-1.5 text-[10px] font-medium ${i <= step ? 'text-mint-400' : 'text-purple-500'}`}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 no-scrollbar">
        {/* Etapa 0 — Conta */}
        {step === 0 && (
          <div className="animate-slide-up space-y-4">
            <div>
              <h2 className="text-xl font-bold text-purple-50">Crie sua conta</h2>
              <p className="mt-1 text-sm text-purple-300">Comece a trocar livros com leitores perto de você.</p>
            </div>
            <Field icon={<User className="h-4 w-4" />} label="Nome completo">
              <input
                value={data.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Seu nome completo"
                className="field-input"
                autoComplete="name"
              />
            </Field>
            <Field icon={<Mail className="h-4 w-4" />} label="E-mail">
              <input
                value={data.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="voce@email.com"
                type="email"
                className="field-input"
                autoComplete="email"
              />
            </Field>
            <Field icon={<Lock className="h-4 w-4" />} label="Senha">
              <div className="relative">
                <input
                  value={data.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  type={showPassword ? 'text' : 'password'}
                  className="field-input pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 active:scale-90"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>
        )}

        {/* Etapa 1 — Identidade */}
        {step === 1 && (
          <div className="animate-slide-up space-y-4">
            <div>
              <h2 className="text-xl font-bold text-purple-50">Identidade</h2>
              <p className="mt-1 text-sm text-purple-300">Usados para verificar a conta e segurança das trocas.</p>
            </div>
            <Field icon={<IdCard className="h-4 w-4" />} label="CPF">
              <input
                value={data.cpf}
                onChange={(e) => set('cpf', maskCPF(e.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                className="field-input"
              />
            </Field>
            <Field icon={<Phone className="h-4 w-4" />} label="Celular com DDD">
              <input
                value={data.phone}
                onChange={(e) => set('phone', maskPhone(e.target.value))}
                placeholder="(11) 90000-0000"
                inputMode="numeric"
                className="field-input"
              />
            </Field>
          </div>
        )}

        {/* Etapa 2 — Endereço */}
        {step === 2 && (
          <div className="animate-slide-up space-y-4">
            <div>
              <h2 className="text-xl font-bold text-purple-50">Endereço residencial</h2>
              <p className="mt-1 text-sm text-purple-300">Para calcular fretes e encontrar trocas próximas.</p>
            </div>
            <Field icon={<MapPin className="h-4 w-4" />} label="CEP">
              <input
                value={data.cep}
                onChange={(e) => set('cep', maskCEP(e.target.value))}
                placeholder="00000-000"
                inputMode="numeric"
                className="field-input"
              />
            </Field>
            <div className="flex gap-3">
              <div className="flex-1">
                <Field label="Rua">
                  <input
                    value={data.street}
                    onChange={(e) => set('street', e.target.value)}
                    placeholder="Rua / Avenida"
                    className="field-input"
                  />
                </Field>
              </div>
              <div className="w-24">
                <Field label="Número">
                  <input
                    value={data.number}
                    onChange={(e) => set('number', e.target.value)}
                    placeholder="123"
                    inputMode="numeric"
                    className="field-input"
                  />
                </Field>
              </div>
            </div>
            <Field label="Bairro">
              <input
                value={data.district}
                onChange={(e) => set('district', e.target.value)}
                placeholder="Seu bairro"
                className="field-input"
              />
            </Field>
            <div className="flex gap-3">
              <div className="flex-1">
                <Field label="Cidade">
                  <input
                    value={data.city}
                    onChange={(e) => set('city', e.target.value)}
                    placeholder="Sua cidade"
                    className="field-input"
                  />
                </Field>
              </div>
              <div className="w-20">
                <Field label="Estado">
                  <input
                    value={data.state}
                    onChange={(e) => set('state', e.target.value.toUpperCase().slice(0, 2))}
                    placeholder="SP"
                    className="field-input"
                  />
                </Field>
              </div>
            </div>

            {/* Switch — Portaria */}
            <div className="rounded-2xl bg-purple-900/60 p-4 ring-1 ring-purple-800">
              <div className="flex items-start gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${data.portariaOk ? 'bg-mint-400/15' : 'bg-purple-800'}`}>
                  <Building2 className={`h-5 w-5 ${data.portariaOk ? 'text-mint-400' : 'text-purple-300'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-purple-50">É possível deixar pacotes na portaria</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-purple-400">
                    Ajuda o motoboy ou carteiro a concluir a entrega caso você não esteja
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => set('portariaOk', !data.portariaOk)}
                  className={`mt-0.5 flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition ${
                    data.portariaOk ? 'bg-mint-400' : 'bg-purple-700'
                  }`}
                  aria-pressed={data.portariaOk}
                  aria-label="Alternar entrega na portaria"
                >
                  <span
                    className={`h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                      data.portariaOk ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Ponto de Referência */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                <Navigation className="h-4 w-4" />
                Ponto de Referência
              </label>
              <div className="relative">
                <textarea
                  value={data.reference}
                  onChange={(e) => set('reference', e.target.value.slice(0, 255))}
                  placeholder="Ex: Casa ao lado da padaria, próximo ao metrô, etc."
                  rows={3}
                  className="field-input resize-none pb-7"
                />
                <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] font-medium text-purple-500">
                  {data.reference.length}/255
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 3 — Seu Estilo Literário */}
        {step === 3 && (
          <div className="animate-slide-up space-y-5">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-400/15 ring-1 ring-mint-400/30">
                  <BookHeart className="h-5 w-5 text-mint-400" />
                </div>
                <h2 className="text-xl font-bold text-purple-50">Seu Estilo Literário</h2>
              </div>
              <p className="mt-1 text-sm text-purple-300">Personalize seu feed: escolha seus gêneros e autores favoritos.</p>
            </div>

            {/* Campo 1 — Gêneros */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-400">Gêneros favoritos</p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => {
                  const active = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition active:scale-95 ${
                        active
                          ? 'bg-mint-400 text-purple-950 shadow-lg shadow-mint-400/20 ring-1 ring-mint-300'
                          : 'bg-purple-900/60 text-purple-200 ring-1 ring-purple-800'
                      }`}
                    >
                      <span>{g.emoji}</span>
                      {g.id}
                      {active && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campo 2 — Autores */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-400">
                Autores favoritos <span className="font-normal text-purple-500">(até 3)</span>
              </p>
              <div className="flex gap-2">
                <input
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAuthor();
                    }
                  }}
                  placeholder="Ex: Haruki Murakami"
                  className="field-input flex-1"
                  disabled={authors.length >= 3}
                />
                <button
                  onClick={addAuthor}
                  disabled={authors.length >= 3 || !authorInput.trim()}
                  className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl bg-purple-800 text-purple-200 disabled:opacity-30 active:scale-90"
                  aria-label="Adicionar autor"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              {authors.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {authors.map((a) => (
                    <span
                      key={a}
                      className="flex items-center gap-1.5 rounded-full bg-mint-400/15 py-1.5 pl-3 pr-1.5 text-xs font-semibold text-mint-300 ring-1 ring-mint-400/30"
                    >
                      <Tag className="h-3 w-3" />
                      {a}
                      <button
                        onClick={() => removeAuthor(a)}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-mint-400/20 text-mint-300 active:scale-90"
                        aria-label={`Remover ${a}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Etapa 4 — Aceite */}
        {step === 4 && (
          <div className="animate-slide-up space-y-4">
            <div>
              <h2 className="text-xl font-bold text-purple-50">Quase lá!</h2>
              <p className="mt-1 text-sm text-purple-300">Revise e aceite os termos para ativar sua conta.</p>
            </div>
            <div className="rounded-2xl bg-purple-900/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-400/15">
                  <Shield className="h-5 w-5 text-mint-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-50">Resumo do cadastro</p>
                  <p className="text-xs text-purple-300">{data.name} · {data.email}</p>
                  <p className="text-xs text-purple-300">{data.city} — {data.state}</p>
                </div>
              </div>
              {(selectedGenres.length > 0 || authors.length > 0) && (
                <div className="mt-3 border-t border-purple-800 pt-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-purple-400">Estilo literário</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedGenres.map((g) => (
                      <span key={g} className="rounded-full bg-mint-400/15 px-2.5 py-1 text-[10px] font-semibold text-mint-300">{g}</span>
                    ))}
                    {authors.map((a) => (
                      <span key={a} className="rounded-full bg-purple-800 px-2.5 py-1 text-[10px] font-semibold text-purple-200">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-purple-900/60 p-4 active:scale-[0.98]">
              <button
                type="button"
                onClick={() => set('acceptedTerms', !data.acceptedTerms)}
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition ${
                  data.acceptedTerms ? 'border-mint-400 bg-mint-400' : 'border-purple-600 bg-transparent'
                }`}
              >
                {data.acceptedTerms && <Check className="h-4 w-4 text-purple-950" />}
              </button>
              <span className="text-sm leading-relaxed text-purple-200">
                Li e concordo com os <span className="font-semibold text-mint-400">Termos de Uso</span> e{' '}
                <span className="font-semibold text-mint-400">Políticas de Privacidade</span> do LIVREI, incluindo o
                tratamento dos meus dados conforme a LGPD.
              </span>
            </label>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-center text-xs font-medium text-red-400">{error}</p>
        )}
      </div>

      {/* Navegação */}
      <div className="flex items-center gap-3 border-t border-purple-800 p-4">
        {step > 0 && (
          <button
            onClick={back}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-800 text-purple-200 active:scale-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        <button
          onClick={next}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 font-bold text-purple-950 active:scale-95"
        >
          {step === 4 ? (
            <>
              <Check className="h-5 w-5" /> Criar conta
            </>
          ) : (
            <>
              Continuar <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-purple-300">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}
