export const siteConfig = {
  name: 'Gilvan Oliveira',
  role: 'Desenvolvedor Full Stack',
  roleShort: 'Desenvolvedor Full Stack',
  url: 'https://gilvanpoliveira.github.io',
  email: 'gilvanoliveira06@gmail.com',
  githubUrl: 'https://github.com/GilvanPOliveira',
  linkedinUrl: 'https://www.linkedin.com/in/gilvanpoliveira/',
  calendarUrl: 'https://cal.com/gilvanpoliveira/reuniao-agendada',
  socialImagePath: '/og-image.svg',
  locale: 'pt-BR',
  ogLocale: 'pt_BR',
  defaultTitle: 'Gilvan Oliveira | Desenvolvedor Full Stack',
  defaultDescription:
    'Portfólio de Gilvan Oliveira, desenvolvedor full stack com foco em aplicações web acessíveis, performáticas e integradas a APIs REST.',
  keywords: [
    'Gilvan Oliveira',
    'desenvolvedor full stack',
    'portfólio',
    'Vue',
    'React',
    'Angular',
    'Python',
    'frontend',
    'backend',
    'acessibilidade',
    'SEO',
  ],
} as const

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projetos', to: '/projetos' },
  { label: 'Sobre', to: '/sobre' },
  { label: 'Contato', to: '/contato' },
] as const

export const routeSeo = {
  home: {
    title: siteConfig.defaultTitle,
    description:
      'Conheça o portfólio de Gilvan Oliveira, com foco em aplicações web modernas, acessíveis e integradas a APIs.',
  },
  projects: {
    title: 'Projetos | Gilvan Oliveira',
    description:
      'Veja projetos reais com detalhes técnicos, links para repositórios, deploys e README completos.',
  },
  projectDetail: {
    title: 'Projeto | Gilvan Oliveira',
    description:
      'Detalhes técnicos, README e links de deploy dos projetos desenvolvidos por Gilvan Oliveira.',
  },
  about: {
    title: 'Sobre | Gilvan Oliveira',
    description:
      'Conheça a trajetória, formações e stacks estudadas por Gilvan Oliveira em desenvolvimento full stack.',
  },
  contact: {
    title: 'Contato | Gilvan Oliveira',
    description:
      'Entre em contato com Gilvan Oliveira por GitHub, LinkedIn, email ou agendamento direto.',
  },
  notFound: {
    title: 'Página não encontrada | Gilvan Oliveira',
    description:
      'A página que você tentou acessar não existe ou foi movida. Volte para o portfólio principal de Gilvan Oliveira.',
  },
} as const
