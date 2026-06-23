export type Wc2026Team = {
  name: string
  iso: string
  group: string
}

export type Wc2026Match = {
  group: string
  home: string
  away: string
  date: string
}

export const WC2026_CHAMPIONSHIP_NAME = 'Copa do Mundo 2026'

export const WC2026_TEAMS: Wc2026Team[] = [
  { name: 'México', iso: 'mx', group: 'A' },
  { name: 'Coreia do Sul', iso: 'kr', group: 'A' },
  { name: 'República Tcheca', iso: 'cz', group: 'A' },
  { name: 'África do Sul', iso: 'za', group: 'A' },
  { name: 'Canadá', iso: 'ca', group: 'B' },
  { name: 'Suíça', iso: 'ch', group: 'B' },
  { name: 'Bósnia e Herzegovina', iso: 'ba', group: 'B' },
  { name: 'Catar', iso: 'qa', group: 'B' },
  { name: 'Brasil', iso: 'br', group: 'C' },
  { name: 'Marrocos', iso: 'ma', group: 'C' },
  { name: 'Escócia', iso: 'gb-sct', group: 'C' },
  { name: 'Haiti', iso: 'ht', group: 'C' },
  { name: 'Estados Unidos', iso: 'us', group: 'D' },
  { name: 'Austrália', iso: 'au', group: 'D' },
  { name: 'Paraguai', iso: 'py', group: 'D' },
  { name: 'Turquia', iso: 'tr', group: 'D' },
  { name: 'Alemanha', iso: 'de', group: 'E' },
  { name: 'Costa do Marfim', iso: 'ci', group: 'E' },
  { name: 'Equador', iso: 'ec', group: 'E' },
  { name: 'Curaçao', iso: 'cw', group: 'E' },
  { name: 'Holanda', iso: 'nl', group: 'F' },
  { name: 'Japão', iso: 'jp', group: 'F' },
  { name: 'Suécia', iso: 'se', group: 'F' },
  { name: 'Tunísia', iso: 'tn', group: 'F' },
  { name: 'Egito', iso: 'eg', group: 'G' },
  { name: 'Irã', iso: 'ir', group: 'G' },
  { name: 'Bélgica', iso: 'be', group: 'G' },
  { name: 'Nova Zelândia', iso: 'nz', group: 'G' },
  { name: 'Espanha', iso: 'es', group: 'H' },
  { name: 'Uruguai', iso: 'uy', group: 'H' },
  { name: 'Cabo Verde', iso: 'cv', group: 'H' },
  { name: 'Arábia Saudita', iso: 'sa', group: 'H' },
  { name: 'França', iso: 'fr', group: 'I' },
  { name: 'Noruega', iso: 'no', group: 'I' },
  { name: 'Senegal', iso: 'sn', group: 'I' },
  { name: 'Iraque', iso: 'iq', group: 'I' },
  { name: 'Argentina', iso: 'ar', group: 'J' },
  { name: 'Áustria', iso: 'at', group: 'J' },
  { name: 'Argélia', iso: 'dz', group: 'J' },
  { name: 'Jordânia', iso: 'jo', group: 'J' },
  { name: 'Colômbia', iso: 'co', group: 'K' },
  { name: 'RD Congo', iso: 'cd', group: 'K' },
  { name: 'Portugal', iso: 'pt', group: 'K' },
  { name: 'Uzbequistão', iso: 'uz', group: 'K' },
  { name: 'Inglaterra', iso: 'gb-eng', group: 'L' },
  { name: 'Gana', iso: 'gh', group: 'L' },
  { name: 'Panamá', iso: 'pa', group: 'L' },
  { name: 'Croácia', iso: 'hr', group: 'L' },
]

export type Wc2026Player = {
  name: string
  slug: string
}

export type Wc2026TeamPlayers = {
  teamName: string
  folder: string
  group: string
  players: Wc2026Player[]
}

export const WC2026_BRAZIL_PLAYERS: Wc2026Player[] = [
  { name: 'Vini Jr', slug: 'vini-jr' },
  { name: 'Neymar', slug: 'neymar' },
  { name: 'Endrick', slug: 'endrick' },
  { name: 'Matheus Cunha', slug: 'matheus-cunha' },
]

export const WC2026_TEAM_PLAYERS: Wc2026TeamPlayers[] = [
  {
    teamName: 'Brasil',
    folder: 'brasil',
    group: 'C',
    players: WC2026_BRAZIL_PLAYERS,
  },
  {
    teamName: 'Portugal',
    folder: 'portugal',
    group: 'K',
    players: [
      { name: 'Cristiano Ronaldo', slug: 'cristiano-ronaldo' },
      { name: 'Bruno Fernandes', slug: 'bruno-fernandes' },
      { name: 'Nuno Mendes', slug: 'nuno-mendes' },
    ],
  },
  {
    teamName: 'Espanha',
    folder: 'espanha',
    group: 'H',
    players: [
      { name: 'Lamine Yamal', slug: 'lamine-yamal' },
      { name: 'Pedri', slug: 'pedri' },
      { name: 'Rodri', slug: 'rodri' },
    ],
  },
  {
    teamName: 'França',
    folder: 'franca',
    group: 'I',
    players: [
      { name: 'Kylian Mbappé', slug: 'kylian-mbappe' },
      { name: 'Antoine Griezmann', slug: 'antoine-griezmann' },
      { name: 'Ousmane Dembélé', slug: 'ousmane-dembele' },
    ],
  },
  {
    teamName: 'Alemanha',
    folder: 'alemanha',
    group: 'E',
    players: [
      { name: 'Jamal Musiala', slug: 'jamal-musiala' },
      { name: 'Florian Wirtz', slug: 'florian-wirtz' },
      { name: 'Kai Havertz', slug: 'kai-havertz' },
    ],
  },
  {
    teamName: 'Inglaterra',
    folder: 'inglaterra',
    group: 'L',
    players: [
      { name: 'Harry Kane', slug: 'harry-kane' },
      { name: 'Bukayo Saka', slug: 'bukayo-saka' },
      { name: 'Jude Bellingham', slug: 'jude-bellingham' },
    ],
  },
  {
    teamName: 'Japão',
    folder: 'japao',
    group: 'F',
    players: [
      { name: 'Takefusa Kubo', slug: 'takefusa-kubo' },
      { name: 'Kaoru Mitoma', slug: 'kaoru-mitoma' },
      { name: 'Ao Tanaka', slug: 'ao-tanaka' },
    ],
  },
]
/** Próximas partidas (rodada 2 restante + rodada 3) com datas oficiais FIFA 2026 */
export const WC2026_UPCOMING_MATCHES: Wc2026Match[] = [
  // 23 de junho — Grupos K e L (2ª rodada)
  {
    group: 'K',
    home: 'Portugal',
    away: 'Uzbequistão',
    date: '2026-06-23T17:00:00.000Z',
  },
  {
    group: 'K',
    home: 'Colômbia',
    away: 'RD Congo',
    date: '2026-06-24T02:00:00.000Z',
  },
  {
    group: 'L',
    home: 'Inglaterra',
    away: 'Gana',
    date: '2026-06-23T20:00:00.000Z',
  },
  {
    group: 'L',
    home: 'Panamá',
    away: 'Croácia',
    date: '2026-06-23T23:00:00.000Z',
  },
  // 24 de junho — Grupos A, B e C (3ª rodada)
  {
    group: 'A',
    home: 'República Tcheca',
    away: 'México',
    date: '2026-06-25T01:00:00.000Z',
  },
  {
    group: 'A',
    home: 'África do Sul',
    away: 'Coreia do Sul',
    date: '2026-06-25T01:00:00.000Z',
  },
  {
    group: 'B',
    home: 'Suíça',
    away: 'Canadá',
    date: '2026-06-24T19:00:00.000Z',
  },
  {
    group: 'B',
    home: 'Bósnia e Herzegovina',
    away: 'Catar',
    date: '2026-06-24T19:00:00.000Z',
  },
  {
    group: 'C',
    home: 'Escócia',
    away: 'Brasil',
    date: '2026-06-24T22:00:00.000Z',
  },
  {
    group: 'C',
    home: 'Marrocos',
    away: 'Haiti',
    date: '2026-06-24T22:00:00.000Z',
  },
  // 25 de junho — Grupos D, E e F (3ª rodada)
  {
    group: 'D',
    home: 'Turquia',
    away: 'Estados Unidos',
    date: '2026-06-26T02:00:00.000Z',
  },
  {
    group: 'D',
    home: 'Paraguai',
    away: 'Austrália',
    date: '2026-06-26T02:00:00.000Z',
  },
  {
    group: 'E',
    home: 'Curaçao',
    away: 'Costa do Marfim',
    date: '2026-06-25T20:00:00.000Z',
  },
  {
    group: 'E',
    home: 'Equador',
    away: 'Alemanha',
    date: '2026-06-25T20:00:00.000Z',
  },
  {
    group: 'F',
    home: 'Japão',
    away: 'Suécia',
    date: '2026-06-25T23:00:00.000Z',
  },
  {
    group: 'F',
    home: 'Tunísia',
    away: 'Holanda',
    date: '2026-06-25T23:00:00.000Z',
  },
  // 26 de junho — Grupos G, H e I (3ª rodada)
  {
    group: 'G',
    home: 'Egito',
    away: 'Irã',
    date: '2026-06-27T03:00:00.000Z',
  },
  {
    group: 'G',
    home: 'Nova Zelândia',
    away: 'Bélgica',
    date: '2026-06-27T03:00:00.000Z',
  },
  {
    group: 'H',
    home: 'Cabo Verde',
    away: 'Arábia Saudita',
    date: '2026-06-27T00:00:00.000Z',
  },
  {
    group: 'H',
    home: 'Uruguai',
    away: 'Espanha',
    date: '2026-06-27T00:00:00.000Z',
  },
  {
    group: 'I',
    home: 'Noruega',
    away: 'França',
    date: '2026-06-26T19:00:00.000Z',
  },
  {
    group: 'I',
    home: 'Senegal',
    away: 'Iraque',
    date: '2026-06-26T19:00:00.000Z',
  },
  // 27 de junho — Grupos J, K e L (3ª rodada)
  {
    group: 'J',
    home: 'Argélia',
    away: 'Áustria',
    date: '2026-06-28T02:00:00.000Z',
  },
  {
    group: 'J',
    home: 'Jordânia',
    away: 'Argentina',
    date: '2026-06-28T02:00:00.000Z',
  },
  {
    group: 'K',
    home: 'Colômbia',
    away: 'Portugal',
    date: '2026-06-28T00:30:00.000Z',
  },
  {
    group: 'K',
    home: 'RD Congo',
    away: 'Uzbequistão',
    date: '2026-06-28T00:30:00.000Z',
  },
  {
    group: 'L',
    home: 'Panamá',
    away: 'Inglaterra',
    date: '2026-06-27T21:00:00.000Z',
  },
  {
    group: 'L',
    home: 'Croácia',
    away: 'Gana',
    date: '2026-06-27T21:00:00.000Z',
  },
]

export function teamLogoPath(iso: string) {
  return `/teams/${iso}.png`
}

export function playerPhotoPath(folder: string, slug: string) {
  return `/players/${folder}/${slug}.png`
}
