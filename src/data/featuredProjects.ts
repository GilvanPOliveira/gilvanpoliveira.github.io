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
    techStack: ['Javascript', 'React', 'Vite', 'Tailwind CSS'],
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
    id: 'calpav',
    name: 'CalPav – Cálculo de Espessura de Pavimento de Concreto',
    tagline: 'Ferramenta acadêmica para dimensionamento de pavimentos rígidos segundo DNIT',
    description:
      'Aplicação desenvolvida como TCC em Engenharia Civil para calcular a espessura de pavimentos de concreto, seguindo a metodologia brasileira recomendada pelo DNIT. Permite lançar cargas por eixo, número previsto de veículos e verificar se a espessura adotada atende aos critérios normativos, com visão organizada dos resultados e apoio à elaboração de memoriais de cálculo.',
    techStack: ['Javascript', 'React', 'Styled-Components', 'Vite'],
    role: 'Desenvolvimento da ferramenta, modelagem dos cálculos e validação acadêmica',
    status: 'online',
    liveUrl: 'https://tcc-2024-calpav.vercel.app/',
    githubUrl: '',
  },
];
