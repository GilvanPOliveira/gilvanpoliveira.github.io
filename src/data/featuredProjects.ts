export type ProjectStatus = 'online' | 'building' | 'paused';

export interface FeaturedProject {
  id: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  role: string;
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: 'vacrochetando',
    name: 'VaCrochetando',
    tagline: 'Ecossistema digital para peças de crochê, aulas e personalizações',
    description: 'Plataforma focada em peças artesanais de crochê, com catálogo organizado, diferentes tipos de produtos, tamanhos, personalizações e fluxo de encomendas pensado para a usuária final',
    techStack: ['Angular', 'TypeScript', 'Tailwind CSS'],
    role: 'Arquitetura, frontend, experiência da usuária',
    status: 'building',
    githubUrl: 'https://github.com/GilvanPOliveira/croche-app',
    liveUrl: 'https://va-crochetando.vercel.app/',
  },
  {
    id: 'swipetok',
    name: 'SwipeTok',
    tagline: 'Landing page para monetização com swipes no TikTok',
    description:
      'Página de vendas focada em conversão, apresentando planos, diferenciais e provas sociais para quem quer usar o formato de swipes para monetizar no TikTok.',
    techStack: ['React', 'Vite', 'Tailwind CSS'],
    role: 'UI, copy inicial, estrutura de planos',
    status: 'online',
    githubUrl: '',
    liveUrl: 'https://swipe-tok.vercel.app/',
  },
  {
    id: 'bsn-pokedex',
    name: 'BSN Pokedex',
    tagline: 'PWA híbrida de Pokémons com Ionic + Angular',
    description:
      'Aplicação híbrida que consome a PokeAPI para listar Pokémons com scroll infinito, exibir detalhes completos (sprites, habilidades, movimentos, encontros) e gerenciar uma lista de favoritos em memória.',
    techStack: ['Ionic 7', 'Angular 15+', 'TypeScript', 'PokeAPI'],
    role: 'Frontend / Mobile Hybrid',
    status: 'online',
    liveUrl: 'https://bsn-pokedex-app.vercel.app/',
    githubUrl: 'https://github.com/GilvanPOliveira/bsn_desafio_tecnico'
  },
  {
    id: 'projeto-4',
    name: 'Projeto em construção #2',
    tagline: 'Outro slot para um futuro projeto importante',
    description:
      'Segundo espaço para um projeto que complemente bem seu portfólio atual — pode ser algo mais voltado a backend, devops ou outro nicho estratégico.',
    techStack: ['A definir'],
    role: 'A definir',
    status: 'building',
  },
];
