import {
  X,
  Settings,
  UserCog,
  MapPinned,
  Shield,
  LifeBuoy,
  Trash2,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface Props {
  onOpenTerms: () => void;
  onClose: () => void;
  onSignOut: () => void;
}

interface MenuItem {
  icon: typeof Shield;
  label: string;
  hint: string;
  action: () => void;
  danger?: boolean;
}

export function SettingsScreen({ onOpenTerms, onClose, onSignOut }: Props) {
  const items: MenuItem[] = [
    { icon: UserCog, label: 'Editar Perfil', hint: 'Nome, foto e dados pessoais', action: () => {} },
    { icon: MapPinned, label: 'Meus Endereços', hint: 'Gerenciar endereços de entrega', action: () => {} },
    { icon: Shield, label: 'Termos de Uso e Segurança', hint: 'Regulamento e LGPD', action: onOpenTerms },
    { icon: LifeBuoy, label: 'Suporte / Ajuda', hint: 'Dúvidas e contato', action: () => {} },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-purple-950">
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-900 text-purple-200 active:scale-90" aria-label="Fechar">
          <X className="h-5 w-5" />
        </button>
        <h2 className="flex items-center gap-2 text-sm font-bold text-purple-50">
          <Settings className="h-4 w-4 text-mint-400" /> Configurações
        </h2>
        <div className="h-9 w-9" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        <div className="space-y-2.5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="flex w-full items-center gap-3 rounded-2xl bg-purple-900/60 p-4 text-left transition active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-950">
                  <Icon className="h-5 w-5 text-mint-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-purple-50">{item.label}</p>
                  <p className="truncate text-xs text-purple-300">{item.hint}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-purple-500" />
              </button>
            );
          })}
        </div>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 rounded-2xl bg-purple-900/60 p-4 text-left transition active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-950">
              <LogOut className="h-5 w-5 text-purple-200" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-purple-100">Sair da conta</p>
              <p className="truncate text-xs text-purple-400">Encerrar sessão neste dispositivo</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-purple-500" />
          </button>

          <button
            onClick={() => {}}
            className="flex w-full items-center gap-3 rounded-2xl bg-red-500/10 p-4 text-left transition active:scale-[0.98] ring-1 ring-red-500/30"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20">
              <Trash2 className="h-5 w-5 text-red-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-red-400">Excluir Conta</p>
              <p className="truncate text-xs text-red-400/70">Remover permanentemente seus dados</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-red-500/50" />
          </button>
        </div>

        <p className="mt-8 text-center text-[10px] text-purple-500">LIVREI v1.0 · Troca de Livros</p>
      </div>
    </div>
  );
}
