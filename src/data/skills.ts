export interface SkillCategory {
  id: string;
  label: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    items: [
      'HTML5',
      'CSS3',
      'Sass',
      'Styled-Components',
      'JavaScript (ES6+)',
      'TypeScript',
      'Vue 3',
      'React',
      'Next.js',
      'Angular',
      'Ionic',
      'Tailwind CSS',
    ],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    items: [
      'Node.js (Fundamentos e APIs REST)',
      'Python (scripts, automações e estudos)',
      'FastAPI (APIs modernas em Python)',
      'Integração com APIs públicas (PokeAPI e outras)',
      'Conceitos de autenticação e autorização',
      'Modelagem de dados e regras de negócio',
    ],
  },
  {
    id: 'data-devops',
    label: 'Dados, Deploy & Workflow',
    items: [
      'Banco de dados relacional (noções de SQL)',
      'PostgreSQL (modelagem e consultas básicas)',
      'Jupyter Notebook (experimentos e estudos Full Stack)',
      'Git & GitHub (fluxo básico de branches e commits)',
      'Vercel (deploy de SPAs e PWAs)',
      'Ambiente de desenvolvimento em Linux/WSL',
    ],
  },
  {
    id: 'architecture',
    label: 'Arquitetura & Padrões',
    items: [
      'SPAs e PWAs',
      'Componentização e Design Systems',
      'Standalone Components (Angular)',
      'Consumo e paginação de APIs REST',
    ],
  },
  {
    id: 'product',
    label: 'Produto & Experiência',
    items: [
      'UX focada em clareza e fluxo',
      'Animações e microinterações',
      'Dark mode e temas visuais',
      'Documentação e READMEs detalhados',
      'Criação de landing pages focadas em conversão',
    ],
  }
];
