export type LabType = 'estudo' | 'experimento' | 'outro';

export interface LabItem {
  id: string;
  title: string;
  description: string;
  type: LabType;
  tags: string[];
  link: string;
}

export const labItems: LabItem[] = [
  {
    id: '3d-print-biqu-b1',
    title: 'Ajustes e firmware da Biqu B1',
    description:
      'Brincando com firmware Marlin, macros e configurações de hardware para melhorar a qualidade das impressões.',
    type: 'experimento',
    tags: ['3D Printing', 'Marlin', 'Hardware'],
    link: ''
  },
  {
    id: 'portfolio-v1',
    title: 'Portfólio v1 – HTML, CSS, JS + anime.js',
    type: 'estudo',
    description:
      'Primeira versão do meu portfólio, focada em acessibilidade, responsividade e animações com anime.js, dark mode com toggle e integração com Cal.com para agendamento de reuniões.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'anime.js', 'Cal.com'],
    link: 'https://gilvanpoliveira.github.io'
  },
  {
    id: 'origamid-labs',
    title: 'Labs Origamid – UI e HTML/CSS avançado',
    type: 'estudo',
    description:
      'Coleção de projetos práticos como Bikcraft, FlexBlog, Surfbot, Wildbeast e outros, focados em layout responsivo, Flexbox, Grid e boas práticas de semântica.',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    link: 'https://github.com/GilvanPOliveira/Origamid'
  },
  {
    id: 'vainaweb-labs',
    title: 'Labs Vai Na Web – Ciclo Frontend & Full Stack',
    type: 'estudo',
    description:
      'Repositório com exercícios e projetos produzidos ao longo do curso do instituto Vai Na Web, organizados em Ciclo Frontend e Ciclo Full Stack, com foco em base sólida de web e lógica.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js (conteúdo do curso)'],
    link: 'https://github.com/GilvanPOliveira/VaiNaWeb'
  },
  {
    id: 'fullstack-mundos',
    title: 'Full Stack – Mundos 1 a 5',
    type: 'estudo',
    description:
      'Organização das atividades do curso de Desenvolvimento Full Stack em “Mundos”, com projetos por níveis e alguns deploys, explorando front, back e integração.',
    tags: ['JavaScript', 'Node.js', 'Jupyter Notebook'],
    link: 'https://github.com/GilvanPOliveira/FullStack'
  },
  {
    id: 'bsn-pokedex-lab',
    title: 'Pokedex híbrida – Ionic + Angular',
    type: 'estudo',
    description:
      'Versão de estudo da Pokedex híbrida criada para o desafio técnico da BSN: scroll infinito, detalhes ricos de cada Pokémon, múltiplas requisições em paralelo e favoritos em memória.',
    tags: ['Ionic 7', 'Angular 15+', 'TypeScript', 'PokeAPI'],
    link: 'https://github.com/GilvanPOliveira/bsn_desafio_tecnico'
  }
];
