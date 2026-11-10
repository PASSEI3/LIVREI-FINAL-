import type { Book, BookListing, User, MatchEntry, MeetupPoint, TradeHistoryEntry, WishlistEntry, UserPreferences } from './types';

export const BOOKS: Book[] = [
  { id: 'b1', title: 'A Biblioteca da Meia-Noite', author: 'Matt Haig', coverClass: 'cover-1', coverEmoji: '🌙', condition: 'Seminovo', category: 'Ficção', notes: 'Pouco uso, sem rasuras.', isbn: '9788542221244', synopsis: 'Nora Seed sempre se perguntou sobre as vidas que poderia ter vivido. Quando se vê em uma biblioteca misteriosa fora do tempo, cada livro representa uma decisão que ela não tomou — um emprego abandonado, um relacionamento interrompido, um sonho esquecido. Entre prateleiras infinitas, Nora descobre que a vida não se mede pelas escolhas que evitamos, mas pela coragem de começar de novo. Uma história sobre arrependimento, segundas chances e a busca por um motivo real para permanecer.' },
  { id: 'b2', title: 'O Homem que Confundiu a Mulher com um Chapéu', author: 'Oliver Sacks', coverClass: 'cover-2', coverEmoji: '🧠', condition: 'Bom Estado', category: 'Não-ficção', notes: 'Páginas levemente amareladas, capa em bom estado.', isbn: '9788535914892', synopsis: 'Em vinte e quatro ensaios clássicos, Oliver Sacks narra casos reais de pacientes cujos mundos se desenharam de formas surpreendentes: um músico que não reconhece rostos, homens que perdem o sentido do próprio corpo, ilhas de memória que sobrevivem ao esquecimento. Com compaixão e rigor, Sacks revela como o cérebro ferido encontra caminhos inesperados para recriar a realidade — e como, por trás de cada déficit, existe uma pessoa inteira tentando narrar a própria existência.' },
  { id: 'b3', title: 'Clube do Livro dos Homens que Não Amam as Mulheres', author: 'Stieg Larsson', coverClass: 'cover-3', coverEmoji: '🐝', condition: 'Marcas de Uso', category: 'Suspense', notes: 'Grifos em lápis nas primeiras páginas, capa com leve desgaste nas bordas.', isbn: '9788535914885', synopsis: 'Mikael Blomkvist, jornalista em desgraça, é contratado para resolver o desaparecimento de Harriet Vanger, jovem heiçã sumida há quatro décadas numa ilha fechada. Ao seu lado entra Lisbeth Salander, hacker brilhante e socialmente cortante, cuja inteligência corrosiva esconde um histórico de violência. Juntos, mergulham numa teia de misoginia, segredos de família e mortes que não deveriam ter sido esquecidas. Um thriller sueco que funde denúncia social e investigação policial numa prosa incansável.' },
  { id: 'b4', title: 'Pequenos Habitos, Grandes Mudanças', author: 'James Clear', coverClass: 'cover-4', coverEmoji: '✨', condition: 'Novo/Lacrado', category: 'Autoajuda', notes: 'Livro sem uso, lacre intacto.', isbn: '9788550809232', synopsis: 'James Clear defende que resultados drásticos nascem de mudanças minúsculas e repetidas — não de viradas de mesa. Em vez de metas grandiosas, propõe sistemas: melhorar 1% por dia, empilhar hábitos sobre rotinas existentes e redesenhar o ambiente para que a escolha certa se torne a mais fácil. Com histórias reais de atletas, cirurgiões e executivos, o livro traduz neurociência do comportamento em passos concretos que cabem numa única manhã.' },
  { id: 'b5', title: 'O Conto da Aia', author: 'Margaret Atwood', coverClass: 'cover-5', coverEmoji: '🩸', condition: 'Seminovo', category: 'Ficção', notes: 'Pouco uso, sem rasuras.', isbn: '9788535932537', synopsis: 'Na República de Gilead, onde a fertilidade se tornou moeda rara, Defred serve como Aia — corpo reprodutivo confiscado pelo regime para gerar filhos das esposas dos Comandantes. Entre memórias do marido desaparecido e da filha arrancada de seus braços, ela registra em silêncio a vida que ainda resiste sob a opressão. Atwood constrói uma distopia claustrofóbica que fala sobre corpo, memória e as pequenas traições cotidianas que sustentam ou derrubam regimes.' },
  { id: 'b6', title: 'Norwegian Wood', author: 'Haruki Murakami', coverClass: 'cover-6', coverEmoji: '🍂', condition: 'Bom Estado', category: 'Romance', notes: 'Páginas levemente amareladas, capa em bom estado.', isbn: '9788535912345', synopsis: 'Toru Watanabe recorda, aos 37 anos, o ano em que tudo mudou: o suicídio do melhor amigo, Kizuki, e o encontro com Naoko, frágil e presa ao luto que os une. Quando Naoko se recolhe num sanatório, Toru se divide entre a memória dela e Midori, viva e imperativa, que lhe pede presença. Ambientado no Tóquio de 1969, o romance de Murakami é uma melancolia narrada em tom baixo, sobre perda, desejo e a dificuldade de continuar vivo para os outros quando alguém se foi.' },
  { id: 'b7', title: '1984', author: 'George Orwell', coverClass: 'cover-7', coverEmoji: '👁️', condition: 'Seminovo', category: 'Clássico', notes: 'Pouco uso, sem rasuras.', isbn: '9788533300092', synopsis: 'Winston Smith trabalha no Ministério da Verdade reescrevendo o passado que o Partido ainda não consolidou. Em Oceânia, a Teletela observa cada gesto, a Novilíngua encolhe o pensamento e o Big Brother é o rosto que tudo vê. Quando Winston começa um diário e um caso proibido com Julia, ele sabe que a captura é questão de tempo — mas é no porão da Polícia do Pensamento que descobre o verdadeiro preço da traição. A distopia de Orwell permanece atual porque fala sobre memória, verdade e a engenharia da linguagem como ferramenta de poder.' },
  { id: 'b8', title: 'A Cor Púrpura', author: 'Alice Walker', coverClass: 'cover-8', coverEmoji: '💜', condition: 'Novo/Lacrado', category: 'Romance', notes: 'Livro sem uso, lacre intacto.', isbn: '9788535914557', synopsis: 'Escrita em cartas endereçadas a Deus e, depois, à irmã missionária, a voz de Celie conduz o leitor por décadas de uma vida marcada pela violência no Sul rural dos Estados Unidos. Ao redor dela, mulheres fortes — Shug Avery, Sofia, Nettie — ensinam-lhe a reconhecer o próprio corpo, o próprio desejo e uma espiritualidade que dispensa castigos. Vencedor do Pulitzer, o romance de Alice Walker é uma epopeia íntima sobre sororidade, autonomia e a lenta reconquista da palavra por quem foi ensinado a ficar calado.' },
  { id: 'b9', title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', coverClass: 'cover-1', coverEmoji: '🦋', condition: 'Bom Estado', category: 'Clássico', notes: 'Páginas levemente amareladas, capa em bom estado.', isbn: '9788535909553', synopsis: 'Da fundação de Macondo por José Arcadio Buendía até a extinção da estirpe sob uma chuva de flores amarelas, sete gerações da família Buendía repetem nomes, destinos e solidões em espiral. Realismo mágico e mito se entrelaçam numa saga que fala sobre incesto, guerra, capital, memória e a impossível tentativa de narrar a própria história antes que ela se repita. Obra-prima de García Márquez que redefiniu a literatura latino-americana do século XX.' },
  { id: 'b10', title: 'O Nome do Vento', author: 'Patrick Rothfuss', coverClass: 'cover-2', coverEmoji: '⚔️', condition: 'Seminovo', category: 'Fantasia', notes: 'Pouco uso, sem rasuras.', isbn: '9788535914762', synopsis: 'Numa estalagem isolada, o taverneiro Kote revela ao cronista a verdadeira história de Kvothe: criança de trupe que virou estudante da Universidade, mago sem dinheiro que caçou o nome do vento entre ruínas e demônios. Entre mentores cruéis, amizades improváveis e uma música que ainda não terminou, Rothfuss constrói um herói cujo maior talento é narrar a própria lenda — e talvez acreditar demais nela.' },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Marina', avatarEmoji: '🦊', city: 'São Paulo - SP', rating: 4.9, tradesCount: 23 },
  { id: 'u2', name: 'Theo', avatarEmoji: '🐺', city: 'São Paulo - SP', rating: 4.7, tradesCount: 11 },
  { id: 'u3', name: 'Bia', avatarEmoji: '🦉', city: 'Guarulhos - SP', rating: 5.0, tradesCount: 42 },
  { id: 'u4', name: 'Léo', avatarEmoji: '🐯', city: 'Osasco - SP', rating: 4.5, tradesCount: 8 },
  { id: 'u5', name: 'Duda', avatarEmoji: '🐰', city: 'São Paulo - SP', rating: 4.8, tradesCount: 17 },
];

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Você',
  avatarEmoji: '🐼',
  city: 'São Paulo - SP',
  rating: 4.8,
  tradesCount: 6,
};

export const FEED_LISTINGS: BookListing[] = [
  { id: 'l1', book: BOOKS[0], ownerId: 'u1', city: 'São Paulo - SP', distanceKm: 1.2 },
  { id: 'l2', book: BOOKS[1], ownerId: 'u3', city: 'Guarulhos - SP', distanceKm: 8.4 },
  { id: 'l3', book: BOOKS[3], ownerId: 'u4', city: 'Osasco - SP', distanceKm: 14.1 },
  { id: 'l4', book: BOOKS[4], ownerId: 'u2', city: 'São Paulo - SP', distanceKm: 3.0 },
  { id: 'l5', book: BOOKS[5], ownerId: 'u5', city: 'São Paulo - SP', distanceKm: 2.5 },
  { id: 'l6', book: BOOKS[6], ownerId: 'u1', city: 'São Paulo - SP', distanceKm: 1.2 },
  { id: 'l7', book: BOOKS[8], ownerId: 'u3', city: 'Guarulhos - SP', distanceKm: 8.4 },
  { id: 'l8', book: BOOKS[9], ownerId: 'u4', city: 'Osasco - SP', distanceKm: 14.1 },
];

export const USER_WISHLIST: WishlistEntry[] = [
  { bookId: 'b7', title: '1984', author: 'George Orwell', coverClass: 'cover-7', coverEmoji: '👁️' },
  { bookId: 'b2', title: 'O Homem que Confundiu a Mulher com um Chapéu', author: 'Oliver Sacks', coverClass: 'cover-2', coverEmoji: '🧠' },
  { bookId: 'b9', title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', coverClass: 'cover-1', coverEmoji: '🦋' },
];

export const MY_SHELF: Book[] = [
  { id: 'm1', title: 'Sapiens', author: 'Yuval Noah Harari', coverClass: 'cover-4', coverEmoji: '🧬', condition: 'Seminovo', notes: 'Pouco uso, sem rasuras.', isbn: '9788535928769' },
  { id: 'm2', title: 'A Cinco Passos de Você', author: 'Rachael Lippincott', coverClass: 'cover-5', coverEmoji: '💧', condition: 'Bom Estado', notes: 'Páginas levemente amareladas, capa em bom estado.', isbn: '9788535932544' },
  { id: 'm3', title: 'Percy Jackson e o Ladrão de Raios', author: 'Rick Riordan', coverClass: 'cover-3', coverEmoji: '⚡', condition: 'Marcas de Uso', notes: 'Grifos em lápis nas primeiras páginas, capa com leve desgaste nas bordas.', isbn: '9788535914893' },
];

export const MEETUP_POINTS: MeetupPoint[] = [
  { id: 'mp1', name: 'Café Literário Vila Madalena', type: 'Cafeteria', address: 'R. Aspicuelta, 380 - Vila Madalena', emoji: '☕', city: 'São Paulo - SP', hours: '08h às 20h' },
  { id: 'mp2', name: 'Livraria Cultura - Conjunto Nacional', type: 'Livraria', address: 'Av. Paulista, 2073 - Cerqueira César', emoji: '📚', city: 'São Paulo - SP', hours: '10h às 22h' },
  { id: 'mp3', name: 'Café da Esquina Pinheiros', type: 'Cafeteria', address: 'R. dos Pinheiros, 421 - Pinheiros', emoji: '☕', city: 'São Paulo - SP', hours: '07h às 19h' },
  { id: 'mp4', name: 'Biblioteca Mário de Andrade', type: 'Biblioteca', address: 'R. da Consolação, 94 - Consolação', emoji: '🏛️', city: 'São Paulo - SP', hours: '09h às 18h' },
  { id: 'mp5', name: 'Shopping Pátio Paulista', type: 'Shopping', address: 'R. dos Tupinambás, 620 - República', emoji: '🛍️', city: 'São Paulo - SP', hours: '10h às 22h' },
  { id: 'mp6', name: 'Estação Metrô Sé', type: 'Metrô', address: 'Praça da Sé, s/n - Centro', emoji: '🚇', city: 'São Paulo - SP', hours: '04h40 às 00h' },
  { id: 'mp7', name: 'Centro Cultural Banco do Brasil', type: 'Centro Cultural', address: 'R. Álvares Penteado, 112 - Centro', emoji: '🎭', city: 'São Paulo - SP', hours: '09h às 20h' },
  { id: 'mp8', name: 'Estação Metrô Vila Mariana', type: 'Metrô', address: 'R. Vergueiro, 1200 - Vila Mariana', emoji: '🚇', city: 'São Paulo - SP', hours: '04h40 às 00h' },
  { id: 'mp9', name: 'Shopping Eldorado', type: 'Shopping', address: 'Av. Rebouças, 3970 - Pinheiros', emoji: '🛍️', city: 'São Paulo - SP', hours: '10h às 22h' },
  { id: 'mp10', name: 'Centro Cultural São Paulo', type: 'Centro Cultural', address: 'R. Augusta, 200 - Consolação', emoji: '🎭', city: 'São Paulo - SP', hours: '09h às 21h' },
];

export const INITIAL_MATCHES: MatchEntry[] = [
  {
    id: 'mt1',
    kind: 'direto',
    bookFrom: BOOKS[7],
    bookTo: MY_SHELF[0],
    partnerName: 'Duda',
    partnerEmoji: '🐰',
    partnerCity: 'São Paulo - SP',
    partnerDistanceKm: 2.5,
    status: 'novo',
    createdAt: '2026-10-24',
  },
];

export const TRADE_HISTORY: TradeHistoryEntry[] = [
  { id: 't1', bookTitle: 'O Iluminado', partnerName: 'Theo', date: '12/09/2026', status: 'trocado' },
  { id: 't2', bookTitle: 'Orgulho e Preconceito', partnerName: 'Bia', date: '28/08/2026', status: 'trocado' },
  { id: 't3', bookTitle: 'Duna', partnerName: 'Léo', date: '05/07/2026', status: 'enviado' },
];

export const INITIAL_PAGES = 0;
export const PAGES_PACK_SIZE = 10;
export const PAGES_PACK_PRICE = 5.0;
export const TRADE_COST_PAGES = 10;
export const WELCOME_BONUS = 10.0;
export const ACQUISITION_BONUS = 0.5;
export const PROMO_CAP = 20.0;
export const ACQUISITION_CAP = 10.0;
export const ACQUISITION_MAX_BOOKS = 20;
export const SERVICE_FEE = 2.0;

export interface WalletEntry {
  id: string;
  amount: number;
  label: string;
  type: 'bonus' | 'acquisition' | 'info' | 'expiry';
  locked?: boolean;
}

export const INITIAL_WALLET: WalletEntry[] = [
  {
    id: 'w1',
    amount: WELCOME_BONUS,
    label: 'Bônus de Boas-Vindas - Inativo (ative cadastrando seu 1º livro)',
    type: 'bonus',
    locked: true,
  },
];

export const GENRE_CATEGORY_MAP: Record<string, string[]> = {
  'Ficção/Fantasia': ['Ficção', 'Fantasia'],
  'Desenvolvimento Pessoal': ['Autoajuda', 'Não-ficção'],
  'Romance': ['Romance'],
  'Suspense/Terror': ['Suspense'],
  'Biografias': ['Não-ficção'],
  'Acadêmicos': ['Clássico', 'Não-ficção'],
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  genres: [],
  authors: [],
};

export interface ShelfLiker {
  id: string;
  name: string;
  avatarEmoji: string;
  city: string;
  rating: number;
  tradesCount: number;
  likedBookId: string;
  shelf: Book[];
  likedAt: string;
}

export const SHELF_LIKERS: ShelfLiker[] = [
  {
    id: 'sl1',
    name: 'Marina',
    avatarEmoji: '🦊',
    city: 'São Paulo - SP',
    rating: 4.9,
    tradesCount: 23,
    likedBookId: 'm1',
    likedAt: '2026-10-27T09:30:00',
    shelf: [
      { id: 's1-a', title: 'O Iluminado', author: 'Stephen King', coverClass: 'cover-3', coverEmoji: '🕯️', condition: 'Bom Estado', category: 'Suspense', notes: 'Capa com leve desgaste.' },
      { id: 's1-b', title: 'Orgulho e Preconceito', author: 'Jane Austen', coverClass: 'cover-5', coverEmoji: '💌', condition: 'Seminovo', category: 'Romance', notes: 'Pouco uso.' },
      { id: 's1-c', title: 'Duna', author: 'Frank Herbert', coverClass: 'cover-2', coverEmoji: '🏜️', condition: 'Novo/Lacrado', category: 'Ficção', notes: 'Lacre intacto.' },
    ],
  },
  {
    id: 'sl2',
    name: 'Léo',
    avatarEmoji: '🐯',
    city: 'Osasco - SP',
    rating: 4.5,
    tradesCount: 8,
    likedBookId: 'm2',
    likedAt: '2026-10-26T14:00:00',
    shelf: [
      { id: 's2-a', title: 'A Garota do Lago', author: 'Taylor Adams', coverClass: 'cover-6', coverEmoji: '🌊', condition: 'Seminovo', category: 'Suspense', notes: 'Sem rasuras.' },
      { id: 's2-b', title: 'Hamlet', author: 'William Shakespeare', coverClass: 'cover-7', coverEmoji: '🎭', condition: 'Bom Estado', category: 'Clássico', notes: 'Páginas amareladas.' },
    ],
  },
  {
    id: 'sl3',
    name: 'Bia',
    avatarEmoji: '🦉',
    city: 'Guarulhos - SP',
    rating: 5.0,
    tradesCount: 42,
    likedBookId: 'm3',
    likedAt: '2026-10-25T20:00:00',
    shelf: [
      { id: 's3-a', title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', coverClass: 'cover-4', coverEmoji: '🌹', condition: 'Novo/Lacrado', category: 'Ficção', notes: 'Edição especial.' },
      { id: 's3-b', title: 'Frankenstein', author: 'Mary Shelley', coverClass: 'cover-8', coverEmoji: '⚡', condition: 'Seminovo', category: 'Clássico', notes: 'Pouco uso.' },
      { id: 's3-c', title: 'O Hobbit', author: 'J.R.R. Tolkien', coverClass: 'cover-1', coverEmoji: '💍', condition: 'Bom Estado', category: 'Fantasia', notes: 'Capa em bom estado.' },
      { id: 's3-d', title: 'Moby Dick', author: 'Herman Melville', coverClass: 'cover-2', coverEmoji: '🐋', condition: 'Marcas de Uso', category: 'Clássico', notes: 'Grifos em lápis.' },
    ],
  },
  {
    id: 'sl4',
    name: 'Theo',
    avatarEmoji: '🐺',
    city: 'São Paulo - SP',
    rating: 4.7,
    tradesCount: 11,
    likedBookId: 'm1',
    likedAt: '2026-10-24T10:00:00',
    shelf: [
      { id: 's4-a', title: 'Neuromancer', author: 'William Gibson', coverClass: 'cover-6', coverEmoji: '🌐', condition: 'Seminovo', category: 'Ficção', notes: 'Pouco uso.' },
      { id: 's4-b', title: 'O Nome da Rosa', author: 'Umberto Eco', coverClass: 'cover-3', coverEmoji: '修道', condition: 'Bom Estado', category: 'Clássico', notes: 'Páginas levemente amareladas.' },
    ],
  },
];
