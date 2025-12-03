export interface Profile {
  name: string;
  headline: string;
  roles: string[];
  shortBio: string;
  email: string;
  github: string;
  linkedin?: string;
  location?: string;
  cal: string;
}

export const profile: Profile = {
  name: 'Gilvan Oliveira',
  headline: 'Desenvolvedor Full Stack',
  roles: [
    'Desenvolvedor Web',
    'Arquitetura e Design de Aplicações',
    'Automação, Integrações e Data Pipelines',
  ],
  shortBio:
    'Transformando ideias em softwares, da prototipação ao deploy,estruturando soluções que equilibram robustez, clareza e experiência de usuário.',
  email: 'gilvanoliveira@gmail.com',
  github: 'https://github.com/GilvanPOliveira',
  linkedin: 'https://www.linkedin.com/in/gilvanpoliveira/',
  cal: 'https://cal.com/gilvanpoliveira/reuniao-agendada',
  location: 'Brasil',
};
