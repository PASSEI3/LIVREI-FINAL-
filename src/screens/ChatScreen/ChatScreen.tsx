import { useState, useRef, useEffect } from 'react';
import { X, Send, ShieldAlert, MapPin, Clock, Phone, ScanLine } from 'lucide-react';
import type { MatchEntry, MeetupPoint } from '@/types';

interface Props {
  match: MatchEntry;
  meetup?: MeetupPoint;
  onClose: () => void;
  onStartHandoff: (match: MatchEntry) => void;
}

interface Msg {
  id: number;
  from: 'me' | 'them';
  text: string;
  time: string;
}

const SEED: Msg[] = [
  { id: 1, from: 'them', text: 'Oi! Tudo certo para a nossa troca? 📚', time: '14:02' },
  { id: 2, from: 'me', text: 'Tudo sim! Que horas você pode no ponto de encontro?', time: '14:05' },
  { id: 3, from: 'them', text: 'Posso amanhã de manhã, por volta das 10h.', time: '14:06' },
];

export function ChatScreen({ match, meetup, onClose, onStartHandoff }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>(SEED);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setMsgs((m) => [...m, { id: Date.now(), from: 'me', text: t, time }]);
    setText('');
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: Date.now() + 1, from: 'them', text: 'Combinado! Te vejo lá 🤝', time },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-purple-900">
      <div className="flex items-center gap-3 border-b border-purple-800 px-4 py-3">
        <button onClick={onClose} className="text-purple-300 active:scale-90" aria-label="Voltar">
          <X className="h-5 w-5" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-700 text-lg">
          {match.partnerEmoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-purple-50">{match.partnerName}</p>
          <p className="text-xs text-mint-400">online agora</p>
        </div>
      </div>

      {/* Safety warning banner */}
      <div className="flex items-start gap-2 bg-amber-500/15 px-4 py-2.5 ring-1 ring-amber-500/30">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p className="text-xs leading-snug text-amber-200">
          <span className="font-bold">Dica de segurança:</span> faça encontros apenas em locais
          públicos e monitorados, de preferência em Pontos de Encontro Oficiais. Nunca aceite
          encontrar em residências ou locais isolados.
        </p>
      </div>

      {meetup && (
        <div className="flex items-center gap-3 bg-mint-400/10 px-4 py-2.5">
          <span className="text-lg">{meetup.emoji}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-mint-200">{meetup.name}</p>
            <p className="flex items-center gap-1 truncate text-[10px] text-mint-300/80">
              <MapPin className="h-2.5 w-2.5" /> {meetup.address} · <Clock className="h-2.5 w-2.5" /> {meetup.hours}
            </p>
          </div>
          <Phone className="h-4 w-4 text-mint-400" />
        </div>
      )}

      <div className="flex-1 space-y-2.5 overflow-y-auto p-4 no-scrollbar">
        {msgs.map((m) => (
          <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-sm ${
                m.from === 'me'
                  ? 'rounded-br-md bg-mint-400 text-purple-950'
                  : 'rounded-bl-md bg-purple-800 text-purple-50'
              }`}
            >
              <p className="leading-snug">{m.text}</p>
              <p className={`mt-0.5 text-[10px] ${m.from === 'me' ? 'text-purple-800' : 'text-purple-400'}`}>
                {m.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {meetup && (
        <button
          onClick={() => onStartHandoff(match)}
          className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-full bg-mint-400 py-3 font-bold text-purple-950 active:scale-95"
        >
          <ScanLine className="h-5 w-5" /> Iniciar validação presencial
        </button>
      )}

      <div className="flex items-center gap-2 border-t border-purple-800 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Mensagem..."
          className="flex-1 rounded-full bg-purple-800 px-4 py-2.5 text-sm text-purple-50 placeholder:text-purple-500 outline-none ring-1 ring-purple-700 focus:ring-mint-400"
        />
        <button
          onClick={send}
          disabled={!text.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-400 text-purple-950 disabled:opacity-40 active:scale-90"
          aria-label="Enviar"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
