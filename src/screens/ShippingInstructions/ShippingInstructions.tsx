import { useState } from 'react';
import {
  X,
  Check,
  Truck,
  Zap,
  Handshake,
  Shield,
  Package,
  Tag,
  MapPin,
  QrCode,
  CloudRain,
  PackageCheck,
  Building2,
  Clock,
  Users,
  ArrowRight,
} from 'lucide-react';
import type { MatchEntry, DeliveryMethod, MeetupPoint } from '@/types';

interface Props {
  match: MatchEntry;
  method: DeliveryMethod;
  meetup?: MeetupPoint;
  onDone: () => void;
}

interface Step {
  icon: typeof Package;
  title: string;
  text: string;
}

const courierSteps: Step[] = [
  {
    icon: CloudRain,
    title: 'Proteção contra chuva',
    text: 'Coloque o livro dentro de uma sacola plástica limpa ou envelope pardo resistente.',
  },
  {
    icon: Package,
    title: 'Lacre seguro',
    text: 'Feche bem o pacote usando fita adesiva para que não abra no trajeto.',
  },
  {
    icon: Tag,
    title: 'Identificação externa',
    text: 'Escreva à caneta do lado de fora do pacote APENAS o Nome Completo de quem vai receber o livro. ⚠️ ATENÇÃO: Por segurança e privacidade de dados, nunca escreva o número de telefone ou o código PIN no pacote.',
  },
];

const correiosSteps: Step[] = [
  {
    icon: Package,
    title: 'Embalagem pardo ou envelope',
    text: 'Envolva o livro em papel pardo resistente ou use um envelope acolchoado, protegendo as bordas e capas contra amassados.',
  },
  {
    icon: Tag,
    title: 'Cole a etiqueta pré-paga',
    text: 'A etiqueta rastreada já foi paga no checkout. Imprima ou cole a etiqueta fornecida no centro da embalagem, sem cobrir códigos.',
  },
  {
    icon: Building2,
    title: 'Poste na agência',
    text: 'Leve o pacote a qualquer agência dos Correios e faça a postagem. O custo na agência é zero — tudo já está pago.',
  },
  {
    icon: Clock,
    title: 'Prazo de 3 dias úteis',
    text: 'Realize a postagem em até 3 dias úteis para não atrasar a troca. O destinatário acompanha o rastreio em tempo real.',
  },
];

const localSteps: Step[] = [
  {
    icon: MapPin,
    title: 'Encontro em local público',
    text: 'Combine o encontro em um Ponto Oficial cadastrado (cafeteria, livraria ou biblioteca) durante o horário comercial, nunca em residências.',
  },
  {
    icon: Users,
    title: 'Confirme a identidade',
    text: 'Verifique o avatar e o nome do parceiro no chat antes da entrega. Em caso de dúvida, chame pelo nome combinado previamente.',
  },
  {
    icon: QrCode,
    title: 'Escanear QR Code na entrega',
    text: 'No momento da entrega, escaneie o QR Code de validação exibido no celular do parceiro para registrar a troca oficialmente.',
  },
  {
    icon: Shield,
    title: 'Validação obrigatória',
    text: 'A troca só é confirmada após o escaneamento bilateral do QR Code. Sem essa validação, o livro continua pendente no sistema.',
  },
];

const config: Record<DeliveryMethod, { title: string; subtitle: string; icon: typeof Truck; steps: Step[]; stepsLabel: string }> = {
  courier: {
    title: 'Entrega Expressa por Motoboy (Rede Uber)',
    subtitle: 'Entrega expressa urbana automatizada via rede Uber. O motoboy coleta o livro na sua porta e entrega direto ao destinatário. O dinheiro do frete fica retido em segurança pela plataforma até a validação do Código PIN em mãos.',
    icon: Zap,
    steps: courierSteps,
    stepsLabel: 'Como embalar o seu livro para o Motoboy 🏍️',
  },
  correios: {
    title: 'Correios',
    subtitle: 'Postagem e embalagem',
    icon: Truck,
    steps: correiosSteps,
    stepsLabel: 'Passo a passo',
  },
  local: {
    title: 'Encontro Direto',
    subtitle: 'Segurança e validação presencial',
    icon: Handshake,
    steps: localSteps,
    stepsLabel: 'Passo a passo',
  },
};

export function ShippingInstructions({ match, method, meetup, onDone }: Props) {
  const [checked, setChecked] = useState<boolean[]>(() => config[method].steps.map(() => false));
  const cfg = config[method];
  const allChecked = checked.every(Boolean);

  const toggle = (i: number) => setChecked((c) => c.map((v, idx) => (idx === i ? !v : v)));

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-950">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onDone} className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900 text-purple-200 active:scale-90" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-sm font-bold text-purple-50">Instruções de Postagem</h2>
        <div className="h-9 w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        {/* Header dinâmico */}
        <div className="mb-5 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-purple-800 to-purple-950 p-4 ring-1 ring-mint-400/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-400 text-purple-950">
            <cfg.icon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-purple-50">{cfg.title}</h3>
            <p className="text-xs text-purple-300">{cfg.subtitle}</p>
          </div>
        </div>

        {/* Resumo do livro */}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-purple-900/60 p-3">
          <span className="text-3xl">{match.bookTo.coverEmoji}</span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase text-purple-400">Você envia</p>
            <p className="truncate text-sm font-bold text-purple-50">{match.bookTo.title}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-purple-500" />
          <span className="text-3xl">{match.bookFrom.coverEmoji}</span>
          <div className="min-w-0 flex-1 text-right">
            <p className="text-[10px] font-semibold uppercase text-mint-400">Você recebe</p>
            <p className="truncate text-sm font-bold text-purple-50">{match.bookFrom.title}</p>
          </div>
        </div>

        {meetup && (method === 'local' || method === 'courier') && (
          <div className="mb-5 flex items-center gap-2 rounded-2xl bg-mint-400/10 p-3 ring-1 ring-mint-400/30">
            <MapPin className="h-4 w-4 shrink-0 text-mint-400" />
            <p className="truncate text-xs text-mint-200">
              Ponto de encontro: <span className="font-semibold">{meetup.name}</span>
            </p>
          </div>
        )}

        {/* Passo a passo */}
        <p className="mb-3 text-xs font-semibold text-purple-300">{cfg.stepsLabel}</p>
        <div className="space-y-3">
          {cfg.steps.map((step, i) => {
            const Icon = step.icon;
            const done = checked[i];
            return (
              <button
                key={i}
                onClick={() => toggle(i)}
                className={`flex w-full items-start gap-3 rounded-2xl p-3.5 text-left ring-1 transition active:scale-[0.98] ${
                  done ? 'bg-mint-400/10 ring-mint-400/50' : 'bg-purple-900/60 ring-purple-700'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${
                  done ? 'bg-mint-400 text-purple-950' : 'bg-purple-950 text-mint-400'
                }`}>
                  {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${done ? 'text-mint-300' : 'text-purple-50'}`}>
                    {i + 1}. {step.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-purple-300">{step.text}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Aviso de segurança */}
        <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-purple-800/40 p-3.5">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" />
          <p className="text-[11px] leading-relaxed text-purple-300">
            Mantenha o livro protegido até a confirmação da entrega. Em caso de problemas, use o chat com o parceiro para resolver antes de finalizar a troca.
          </p>
        </div>
      </div>

      <div className="border-t border-purple-800 p-4">
        <button
          onClick={onDone}
          className={`flex w-full items-center justify-center gap-2 rounded-full py-4 font-bold transition active:scale-95 ${
            allChecked ? 'bg-mint-400 text-purple-950' : 'bg-purple-800 text-purple-200'
          }`}
        >
          <PackageCheck className="h-5 w-5" />
          {allChecked ? 'Tudo pronto! Entendi as instruções' : 'Confirmar cada passo acima'}
        </button>
      </div>
    </div>
  );
}
