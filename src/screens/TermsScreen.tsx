import { X, Shield, Truck, QrCode, Database, FileText } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function TermsScreen({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[55] flex flex-col bg-purple-950">
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900 text-purple-200 active:scale-90" aria-label="Voltar">
          <X className="h-5 w-5" />
        </button>
        <h2 className="flex items-center gap-2 text-sm font-bold text-purple-50">
          <FileText className="h-4 w-4 text-mint-400" /> Termos de Uso e Segurança
        </h2>
        <div className="h-9 w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar">
        <div className="mb-5 flex items-center gap-4 rounded-3xl bg-gradient-to-br from-purple-800 to-purple-950 p-4 ring-1 ring-mint-400/40">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-400 text-purple-950">
            <Shield className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-50">Regulamento do LIVREI</h3>
            <p className="text-xs text-purple-300">Última atualização: outubro de 2026</p>
          </div>
        </div>

        <Section icon={Truck} title="1. Prazo de Postagem — Correios">
          <p>
            Após a confirmação do pagamento do frete, o remetente tem o prazo de <b>3 (três) dias úteis</b> para realizar
            a postagem do livro em uma agência dos Correios. A etiqueta rastreada é pré-paga no momento do checkout —
            nenhum custo adicional é cobrado na agência.
          </p>
          <p>
            O não cumprimento do prazo pode resultar no cancelamento automático da troca e devolução das Moedas
            reservadas ao solicitante. O rastreio fica disponível em tempo real dentro do app até a confirmação da
            entrega.
          </p>
        </Section>

        <Section icon={QrCode} title="2. Segurança nos Encontros Presenciais">
          <p>
            Para trocas presenciais (Encontro Direto ou Motoboy Rede Uber), o encontro deve ocorrer em{' '}
            <b>Pontos de Encontro Oficiais</b> cadastrados — cafeterias, livrarias ou bibliotecas — preferencialmente
            durante o horário comercial. Encontros em residências ou locais isolados são <b>fortemente desaconselhados</b>.
          </p>
          <p>
            A entrega do livro deve ser obrigatoriamente validada por meio do{' '}
            <b>escaneamento bilateral do QR Code</b> exibido no app de cada usuário no momento da troca. Sem essa
            validação, o livro permanece como pendente e a troca não é confirmada no sistema. Isso protege ambas as
            partes contra disputas e garante o registro oficial da entrega.
          </p>
        </Section>

        <Section icon={Database} title="3. Política de Dados — LGPD">
          <p>
            O LIVREI coleta e trata seus dados pessoais (nome, CPF, e-mail, celular e endereço) em conformidade com a{' '}
            <b>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</b>. Seus dados são utilizados exclusivamente para:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Verificação de identidade e segurança da plataforma;</li>
            <li>Cálculo de fretes e encontro de leitores próximos;</li>
            <li>Comunicação sobre o andamento das trocas;</li>
            <li>Prevenção de fraudes e moderação de conduta.</li>
          </ul>
          <p className="mt-2">
            Você pode solicitar a qualquer momento a <b>acesso, correção ou exclusão</b> dos seus dados através da
            opção "Suporte / Ajuda" nas Configurações. Não compartilhamos seus dados com terceiros para fins
            comerciais.
          </p>
        </Section>

        <Section icon={Shield} title="4. Conduta e Responsabilidade">
          <p>
            É proibido cadastrar livros que não possua, falsificar condições de obra ou utilizar dados de terceiros.
            Condutas fraudulentas resultam em suspensão imediata da conta. O LIVREI atua como intermediador de conexão
            entre leitores e não se responsabiliza pela qualidade física do livro trocado, apenas pela infraestrutura
            de validação e rastreio.
          </p>
        </Section>

        <Section icon={Shield} title="5. Segurança do Acervo, Privacidade e Moedas">
          <p>
            <b>Segurança do Acervo:</b> É obrigatório o envio de 3 fotos reais (Capa/Lombada, Laterais e Miolo) seguindo as guias 3D no momento do cadastro do livro.
          </p>
          <p>
            <b>Privacidade de Entrega (LGPD):</b> O remetente deve escrever no pacote apenas o Nome Completo do destinatário. É proibido anotar números de telefone ou códigos PIN na embalagem.
          </p>
          <p>
            <b>Validação por PIN Secreto:</b> O receptor do livro deve manter o PIN de 4 dígitos em segredo e só ditá-lo ao entregador após abrir o pacote e conferir o estado da obra.
          </p>
          <p>
            <b>Economia de Moedas:</b> As moedas promocionais ganhas expiram em 90 dias. O limite de incentivo por acervo é de 10,0 moedas extras e o saldo promocional máximo na carteira é de 20,0 moedas.
          </p>
        </Section>

        <div className="mt-6 rounded-2xl bg-purple-900/60 p-4">
          <p className="text-[11px] leading-relaxed text-purple-400">
            Ao continuar utilizando o LIVREI, você declara ter lido e concordado com todos os termos acima. Em caso de
            dúvidas, entre em contato pelo canal de Suporte.
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Shield; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-900">
          <Icon className="h-4 w-4 text-mint-400" />
        </div>
        <h4 className="text-sm font-bold text-purple-50">{title}</h4>
      </div>
      <div className="space-y-2 rounded-2xl bg-purple-900/40 p-4 text-xs leading-relaxed text-purple-200">
        {children}
      </div>
    </div>
  );
}
