import { useState } from 'react';
import { Copy, Check, QrCode, Truck, Shield, X, ArrowRight, MapPin, Handshake, Zap, AlertTriangle, Clock, Hourglass, RefreshCw } from 'lucide-react';
import type { MatchEntry, DeliveryMethod, MeetupPoint } from '@/types';
import { CURRENT_USER, MEETUP_POINTS } from '@/data';
import { BookCover } from '@/components/BookCover/BookCover';
import { MeetupPopupModal } from '@/components/MeetupPopupModal';

interface Props {
  match: MatchEntry;
  onClose: () => void;
  onPaid: (method: DeliveryMethod, meetup?: MeetupPoint) => void;
}

const SERVICE_FEE = 2.0;
const FREIGHT = 11.5;
const COURIER_PRICE = 22.0;

function generatePixCode(match: MatchEntry, total: number): string {
  const totalStr = total.toFixed(2).replace('.', ',');
  const id = match.id.toUpperCase();
  return `00020126360014BR.GOV.BCB.PIX0114passei@troca.com5204000053039865802BR5913LIVREI TROCA6009SAO PAULO62${id.length
    .toString()
    .padStart(2, '0')}${id}6307${totalStr.replace(/[^0-9]/g, '').slice(-4)}`;
}

export function PaymentScreen({ match, onClose, onPaid }: Props) {
  const sameCity = match.partnerCity === CURRENT_USER.city;
  const distanceKm = match.partnerDistanceKm ?? 0;
  const [method, setMethod] = useState<DeliveryMethod>(sameCity ? 'local' : 'correios');
  const [meetup, setMeetup] = useState<MeetupPoint | null>(null);
  const [showMeetup, setShowMeetup] = useState(false);
  const [stage, setStage] = useState<'pay' | 'waiting' | 'success' | 'released'>('pay');
  const [copied, setCopied] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState<DeliveryMethod | null>(null);
  const [pin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const isSimultaneous = match.kind === 'direto';

  const total = method === 'local' ? SERVICE_FEE : method === 'courier' ? SERVICE_FEE + COURIER_PRICE : SERVICE_FEE + FREIGHT;
  const pixCode = generatePixCode(match, total);

  const handleCopy = () => {
    navigator.clipboard?.writeText(pixCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectMethod = (target: DeliveryMethod) => {
    if (!sameCity && (target === 'local' || target === 'courier')) {
      setConfirmPopup(target);
      return;
    }
    setMethod(target);
    if (target === 'local') {
      setShowMeetup(true);
    }
  };

  const confirmSwitchToCorreios = () => {
    setMethod('correios');
    setConfirmPopup(null);
  };

  const confirmProceed = () => {
    if (confirmPopup) setMethod(confirmPopup);
    if (confirmPopup === 'local') setShowMeetup(true);
    setConfirmPopup(null);
  };

  const handleSimulatePay = () => {
    setStage('waiting');
  };

  const handleSimulateApproval = () => {
    setStage('success');
  };

  const handleSimulatePartnerPaid = () => {
    setStage('released');
  };

  const handleFinish = () => {
    onPaid(method, meetup ?? undefined);
  };

  const canPay = method === 'correios' || method === 'courier' || (method === 'local' && meetup !== null);

  const optionLabel = (m: DeliveryMethod): string => {
    if (m === 'local') return 'Retirada em mãos';
    if (m === 'courier') return 'Entrega Expressa por Motoboy (Rede Uber)';
    return 'Envio pelos Correios';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-purple-950/80 backdrop-blur-sm">
      <div className="animate-slide-up flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-4xl bg-purple-900 no-scrollbar">
        <div className="z-20 flex shrink-0 items-center justify-between border-b border-purple-800 bg-purple-900 px-5 py-4 shadow-lg shadow-purple-950/40">
          <h2 className="text-base font-bold text-purple-50">Checkout seguro</h2>
          <button onClick={onClose} className="text-purple-300 active:scale-90" aria-label="Fechar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="z-0 flex-1 overflow-y-auto p-5 no-scrollbar">
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-purple-800/60 p-3">
            <BookCover book={match.bookFrom} className="h-20 w-14" emojiSize="text-xl" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase text-mint-400">Você recebe</p>
              <p className="truncate text-sm font-bold text-purple-50">{match.bookFrom.title}</p>
              <p className="truncate text-xs text-purple-300">{match.bookFrom.author}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-purple-500" />
            <div className="min-w-0 flex-1 text-right">
              <p className="text-[10px] font-semibold uppercase text-purple-400">Você envia</p>
              <p className="truncate text-sm font-bold text-purple-50">{match.bookTo.title}</p>
              <p className="truncate text-xs text-purple-300">{match.bookTo.author}</p>
            </div>
          </div>

          {/* Delivery method selection */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold text-purple-300">Forma de entrega</p>
            <div className="space-y-2">
              {/* Opção 1 — Encontro Direto */}
              <button
                onClick={() => selectMethod('local')}
                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left ring-1 transition active:scale-[0.98] ${
                  method === 'local' ? 'bg-mint-400/15 ring-mint-400' : 'bg-purple-800/50 ring-purple-700'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-950">
                  <Handshake className="h-5 w-5 text-mint-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-50">Encontro Direto</span>
                    <span className="rounded-full bg-mint-400 px-2 py-0.5 text-[10px] font-bold text-purple-950">
                      Sem frete
                    </span>
                  </div>
                  {meetup && method === 'local' ? (
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="flex min-w-0 items-center gap-1 text-xs font-semibold text-mint-300">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">Retirada em mãos: {meetup.name}</span>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMeetup(true);
                        }}
                        className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-mint-400 underline underline-offset-2 active:scale-95"
                      >
                        <RefreshCw className="h-3 w-3" /> Alterar
                      </button>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-xs text-purple-300">Retirada em mãos num Ponto Oficial.</p>
                  )}
                </div>
                <div className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${method === 'local' ? 'border-mint-400 bg-mint-400' : 'border-purple-500'}`} />
              </button>

              {/* Opção 2 — Correios */}
              <button
                onClick={() => selectMethod('correios')}
                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left ring-1 transition active:scale-[0.98] ${
                  method === 'correios' ? 'bg-mint-400/15 ring-mint-400' : 'bg-purple-800/50 ring-purple-700'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-950">
                  <Truck className="h-5 w-5 text-purple-200" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-50">Correios (Impresso Módico)</span>
                    <span className="rounded-full bg-purple-700 px-2 py-0.5 text-[10px] font-semibold text-mint-300">
                      Recomendado
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-purple-300">
                    Tarifa reduzida exclusiva para livros com etiqueta rastreada
                  </p>
                </div>
                <div className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${method === 'correios' ? 'border-mint-400 bg-mint-400' : 'border-purple-500'}`} />
              </button>

              {/* Opção 3 — Entrega Expressa por Motoboy (Rede Uber) */}
              <button
                onClick={() => selectMethod('courier')}
                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left ring-1 transition active:scale-[0.98] ${
                  method === 'courier' ? 'bg-mint-400/15 ring-mint-400' : 'bg-purple-800/50 ring-purple-700'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-950">
                  <Zap className="h-5 w-5 text-mint-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-50">Entrega Expressa por Motoboy (Rede Uber)</span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-purple-300">
                    Entrega expressa urbana automatizada via rede Uber. O motoboy coleta o livro na sua porta e entrega direto ao destinatário. O dinheiro do frete fica retido em segurança pela plataforma até a validação do Código PIN em mãos.
                  </p>
                </div>
                <div className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${method === 'courier' ? 'border-mint-400 bg-mint-400' : 'border-purple-500'}`} />
              </button>
            </div>

            {!sameCity && (
              <p className="mt-2 flex items-center gap-1 text-[11px] text-amber-400">
                <MapPin className="h-3 w-3" />
                {match.partnerCity} · {distanceKm < 5 ? `${distanceKm} km` : `~${Math.round(distanceKm)} km`} de você
              </p>
            )}
          </div>

          {/* Summary — colado logo abaixo das opções de frete, atualizando dinamicamente */}
          <div className="mb-3 rounded-2xl bg-purple-800/40 p-4 text-sm">
            <div className="flex justify-between py-1 text-purple-200">
              <span>Moedas da troca</span>
              <span className={`font-semibold ${isSimultaneous ? 'text-mint-400' : 'text-amber-300'}`}>
                {isSimultaneous ? '0 Moedas' : 'Débito de 10 Moedas'}
              </span>
            </div>
            <div className="flex justify-between py-1 text-purple-200">
              <span className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-mint-400" />
                Taxa de Manutenção Compartilhada
              </span>
              <span className="font-semibold">R$ {SERVICE_FEE.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between py-1 text-purple-200">
              <span>{method === 'local' ? 'Frete' : method === 'courier' ? 'Frete (Motoboy Rede Uber)' : 'Frete (Impresso Módico)'}</span>
              <span className={`font-semibold ${method === 'local' ? 'text-mint-400' : ''}`}>
                {method === 'local'
                  ? 'Grátis'
                  : method === 'courier'
                  ? `R$ ${COURIER_PRICE.toFixed(2).replace('.', ',')}`
                  : `R$ ${FREIGHT.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-purple-700 pt-2 text-purple-50">
              <span className="font-bold">Total</span>
              <span className="font-bold text-mint-400">R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Explicação da taxa compartilhada */}
          <div className="mb-4 rounded-2xl bg-mint-400/10 p-3 ring-1 ring-mint-400/30">
            <div className="flex items-start gap-2">
              <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" />
              <p className="text-[11px] leading-relaxed text-mint-200">
                A <span className="font-semibold text-mint-300">Taxa de Manutenção Compartilhada</span> é dividida entre as duas partes (R$ 2,00 de cada) para garantir a segurança e a sustentabilidade das trocas no LIVREI. O chat de endereço, a etiqueta dos Correios e o QR Code de encontro só são liberados após <span className="font-semibold text-mint-300">ambos os pagamentos</span> serem confirmados.
              </p>
            </div>
          </div>

          {stage === 'pay' && (
            <>
              <div className="mb-4 rounded-2xl bg-white p-4">
                <div className="flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-xl bg-purple-950">
                    <QrCode className="h-32 w-32 text-purple-100" />
                    <div className="absolute right-2 top-2 text-xs">🟣</div>
                    <div className="absolute bottom-2 left-2 text-xs">📗</div>
                  </div>
                </div>
                <p className="mt-3 text-center text-xs font-medium text-purple-700">Escaneie o QR Code ou copie o código</p>
              </div>

              <button
                onClick={handleCopy}
                className={`mb-3 flex w-full items-center justify-center gap-2 rounded-2xl p-3.5 font-bold transition active:scale-[0.98] ${
                  copied
                    ? 'bg-mint-400 text-purple-950'
                    : 'bg-purple-800 text-purple-100'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-5 w-5" /> Código Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-5 w-5" /> Copiar Código Pix
                  </>
                )}
              </button>

              <div className="mb-3 rounded-xl bg-purple-950/50 p-3 ring-1 ring-purple-800">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-purple-400">Código Copia e Cola</p>
                <p className="truncate font-mono text-[11px] text-purple-300">{pixCode}</p>
              </div>

              <button
                onClick={handleSimulatePay}
                disabled={!canPay}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-4 font-bold text-purple-950 disabled:opacity-40 active:scale-95"
              >
                <Shield className="h-5 w-5" /> Simular pagamento Pix
              </button>
              <p className="mt-2 text-center text-[10px] text-purple-400">
                Ambiente de teste. Nenhum valor real é cobrado.
              </p>
              {method === 'local' && !meetup && (
                <p className="mt-1 text-center text-[10px] text-amber-400">
                  Selecione um Ponto de Encontro para continuar.
                </p>
              )}
            </>
          )}

          {stage === 'waiting' && (
            <div className="animate-scale-in flex flex-col items-center py-10 text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-800 ring-2 ring-purple-700">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-purple-600 border-t-mint-400" />
              </div>
              <h3 className="text-base font-bold text-purple-50">Aguardando confirmação do pagamento...</h3>
              <p className="mt-1.5 max-w-xs text-sm text-purple-300">
                Estamos validando seu Pix. Isso costuma levar alguns instantes.
              </p>

              <button
                onClick={handleSimulateApproval}
                className="mt-7 rounded-full border border-purple-700 px-4 py-2 text-[11px] font-medium text-purple-400 underline underline-offset-2 active:scale-95"
              >
                Simular Aprovação de Pix
              </button>
              <p className="mt-2 text-[10px] text-purple-600">Botão de teste do protótipo</p>
            </div>
          )}

          {stage === 'success' && (
            <div className="animate-scale-in flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mint-400">
                <Check className="h-10 w-10 text-purple-950" />
              </div>
              <h3 className="text-lg font-bold text-purple-50">Pagamento confirmado!</h3>
              <p className="mt-1.5 max-w-xs text-sm text-purple-300">
                Aguardando o outro leitor confirmar a taxa para liberar o envio.
              </p>

              <div className="mt-5 w-full space-y-2 text-left">
                <StatusRow
                  done
                  label="Seu pagamento"
                  detail={`Confirmado (R$ ${total.toFixed(2).replace('.', ',')})`}
                />
                <StatusRow
                  done={false}
                  label="Pagamento do outro usuário"
                  detail="Aguardando confirmação..."
                />
              </div>

              <div className="mt-5 w-full rounded-2xl bg-mint-400/10 p-3.5 ring-1 ring-mint-400/30">
                <div className="flex items-start gap-2">
                  <Hourglass className="mt-0.5 h-4 w-4 shrink-0 text-mint-400" />
                  <p className="text-[11px] leading-relaxed text-mint-200">
                    A etiqueta de envio e o código de rastreio serão liberados assim que o outro usuário confirmar o pagamento da taxa de manutenção de <span className="font-semibold text-mint-300">R$ 2,00</span>. Ele tem um prazo de até <span className="font-semibold text-mint-300">48 horas úteis</span> para confirmar. Caso o prazo expire, seu dinheiro será estornado automaticamente no Pix.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulatePartnerPaid}
                className="mt-5 rounded-full border border-purple-700 px-4 py-2 text-[11px] font-medium text-purple-400 underline underline-offset-2 active:scale-95"
              >
                Simular Pagamento do Outro Usuário
              </button>
              <p className="mt-2 text-[10px] text-purple-600">Botão de teste do protótipo</p>
            </div>
          )}

          {stage === 'released' && (
            <div className="animate-scale-in flex flex-col items-center py-8 text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-mint-400">
                <Check className="h-10 w-10 text-purple-950" />
              </div>
              <h3 className="text-lg font-bold text-purple-50">{method === 'courier' ? 'Parabéns! Pagamento Confirmado e Envio Agendado!' : 'Parabéns! Pagamento Confirmado e Troca Liberada!'}</h3>
              <p className="mt-1.5 max-w-xs text-sm text-purple-300">
                {method === 'courier'
                  ? 'Prepare o seu pacote utilizando uma sacola limpa ou envelope resistente, escreva o Nome Completo do destinatário do lado de fora e aguarde o motoboy da Uber chegar para a coleta.'
                  : method === 'local'
                    ? 'Combine o encontro com o outro leitor para finalizar a troca.'
                    : 'Ambos os pagamentos foram confirmados. O envio foi liberado.'}
              </p>

              <div className="mt-5 w-full space-y-2 text-left">
                <StatusRow
                  done
                  label="Seu pagamento"
                  detail={`Confirmado (R$ ${total.toFixed(2).replace('.', ',')})`}
                />
                <StatusRow
                  done
                  label="Pagamento do outro usuário"
                  detail="Confirmado"
                />
              </div>

              {method === 'correios' && (
                <div className="mt-5 w-full rounded-2xl bg-purple-800/60 p-4 text-left ring-1 ring-purple-700">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-mint-400" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-purple-400">Código de Rastreamento</span>
                  </div>
                  <p className="mt-1.5 font-mono text-base font-bold text-mint-400">BR876543210BR</p>
                  <div className="mt-3 border-t border-purple-700 pt-3">
                    <p className="text-xs font-medium text-purple-200">Status atual</p>
                    <p className="mt-0.5 text-sm text-purple-100">
                      Etiqueta liberada! Aguardando postagem pelo remetente
                    </p>
                  </div>
                </div>
              )}

              {method === 'courier' && (
                <div className="mt-5 w-full rounded-2xl bg-purple-800/60 p-4 text-left ring-1 ring-purple-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-purple-400">Seu PIN de entrega</p>
                  <p className="mt-1.5 font-mono text-3xl font-bold tracking-[0.4em] text-mint-400">{pin}</p>
                  <div className="mt-3 rounded-xl bg-amber-400/10 p-3 ring-1 ring-amber-400/40">
                    <p className="text-[11px] leading-relaxed text-amber-200">
                      🔒 SEGURANÇA: Mantenha este PIN em segredo. Só dite estes 4 dígitos para o motoboy APÓS abrir o pacote e confirmar que o livro recebido está correto e em bom estado.
                    </p>
                  </div>
                </div>
              )}

              {method !== 'correios' && (
                <div className="mt-5 flex items-center gap-2 rounded-full bg-purple-800 px-4 py-2 text-sm text-purple-100">
                  <Handshake className="h-4 w-4 text-mint-400" />
                  {method === 'courier' ? 'Entrega expressa liberada' : 'Troca local liberada'}
                </div>
              )}

              <button
                onClick={handleFinish}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-4 font-bold text-purple-950 active:scale-95"
              >
                Concluir
              </button>
            </div>
          )}
        </div>
      </div>

      {showMeetup && (
        <MeetupPopupModal
          points={MEETUP_POINTS}
          city={CURRENT_USER.city}
          selected={meetup}
          onSelect={(p) => {
            setMeetup(p);
            setShowMeetup(false);
          }}
          onClose={() => setShowMeetup(false)}
        />
      )}

      {/* Cidades diferentes — pop-up de confirmação */}
      {confirmPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-purple-950/85 p-5 backdrop-blur-sm">
          <div className="animate-scale-in w-full max-w-sm overflow-hidden rounded-4xl bg-purple-900 ring-1 ring-purple-700">
            <div className="flex items-center gap-2 border-b border-purple-800 px-5 py-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
              <h2 className="text-sm font-bold text-purple-50">Cidades Diferentes detectadas</h2>
            </div>
            <div className="p-5">
              <p className="text-sm leading-relaxed text-purple-200">
                Você selecionou <span className="font-semibold text-purple-50">{optionLabel(confirmPopup)}</span>,
                mas o outro usuário está em <span className="font-semibold text-mint-400">{match.partnerCity}</span>
                {' '}({distanceKm < 5 ? `${distanceKm} km` : `~${Math.round(distanceKm)} km`} de você).
                Deseja realmente prosseguir com esta escolha?
              </p>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={confirmSwitchToCorreios}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-mint-400 py-3.5 font-bold text-purple-950 active:scale-95"
                >
                  <Truck className="h-5 w-5" /> Mudar para Correios
                </button>
                <button
                  onClick={confirmProceed}
                  className="w-full py-2.5 text-center text-sm font-medium text-purple-300 underline underline-offset-2 active:scale-95"
                >
                  Sim, quero continuar com o {confirmPopup === 'local' ? 'encontro' : 'motoboy (Rede Uber)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusRow({ done, label, detail }: { done: boolean; label: string; detail: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl p-3 ${done ? 'bg-mint-400/15 ring-1 ring-mint-400/30' : 'bg-purple-800/60 ring-1 ring-purple-700'}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? 'bg-mint-400' : 'bg-purple-700'}`}>
        {done ? (
          <Check className="h-4.5 w-4.5 text-purple-950" />
        ) : (
          <Clock className="h-4 w-4 animate-pulse text-purple-300" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-semibold ${done ? 'text-mint-300' : 'text-purple-200'}`}>{label}</p>
        <p className={`truncate text-xs ${done ? 'text-mint-200' : 'text-purple-400'}`}>{detail}</p>
      </div>
    </div>
  );
}
