export type StackItem = {
  label: string
  icon: string
}

export const coreStacks: StackItem[] = [
  { label: 'JavaScript', icon: 'js' },
  { label: 'TypeScript', icon: 'ts' },
  { label: 'Vue', icon: 'vue' },
  { label: 'React', icon: 'react' },
  { label: 'Angular', icon: 'angular' },
  { label: 'Python', icon: 'python' },
  { label: 'PostgreSQL', icon: 'postgres' },
]

export const frontend: StackItem[] = [
  { label: 'HTML5', icon: 'html' },
  { label: 'JavaScript', icon: 'js' },
  { label: 'TypeScript', icon: 'ts' },
  { label: 'Vue', icon: 'vue' },
  { label: 'React', icon: 'react' },
  { label: 'Angular', icon: 'angular' },
  { label: 'Next.js', icon: 'nextjs' },
  { label: 'jQuery', icon: 'jquery' },
]

export const styling: StackItem[] = [
  { label: 'Sass', icon: 'sass' },
  { label: 'CSS', icon: 'css' },
  { label: 'Tailwind CSS', icon: 'tailwind' },
  { label: 'Bootstrap', icon: 'bootstrap' },
  { label: 'Styled Components', icon: 'styledcomponents' },
]

export const backend: StackItem[] = [
  { label: 'Python', icon: 'python' },
  { label: 'Flask', icon: 'flask' },
  { label: 'Node.js', icon: 'nodejs' },
  { label: 'Java', icon: 'java' },
  { label: 'PHP', icon: 'php' },
]

export const databasesRelational: StackItem[] = [
  { label: 'PostgreSQL', icon: 'postgres' },
  { label: 'MySQL', icon: 'mysql' },
]

export const databasesNoSQL: StackItem[] = [
  { label: 'MongoDB', icon: 'mongodb' },
  { label: 'Firebase', icon: 'firebase' },
  { label: 'supabase', icon: 'supabase' },
]

export const mobile: StackItem[] = [
  { label: 'Flutter', icon: 'flutter' },
  { label: 'Dart', icon: 'dart' },
  { label: 'Swift', icon: 'swift' },
]

export const Tools: StackItem[] = [
  { label: 'Git', icon: 'git' },
  { label: 'Postman', icon: 'postman' },
  { label: 'Android Studio', icon: 'androidstudio' },
  { label: 'WordPress', icon: 'wordpress' },
  { label: 'PyCharm', icon: 'pycharm' },
  { label: 'Regex', icon: 'regex' },
  { label: 'Vite', icon: 'vite' },
]

export const engineeringAndOtherStudies: StackItem[] = [
  { label: 'OpenCV', icon: 'opencv' },
  { label: 'Arduino', icon: 'arduino' },
  { label: 'Raspberry Pi', icon: 'raspberrypi' },
  { label: 'AutoCAD', icon: 'autocad' },
  { label: 'SketchUp', icon: 'sketchup' },
  { label: 'Blender', icon: 'blender' },
  { label: 'Photoshop', icon: 'photoshop' },
  { label: 'Unreal Engine', icon: 'unrealengine' },
]

export const studyStacks: StackItem[] = [
  ...frontend,
  ...styling,
  ...backend,
  ...databasesRelational,
  ...databasesNoSQL,
  ...mobile,
  ...Tools,
  ...engineeringAndOtherStudies,
]

export const studyStackGroups = [
  { title: 'Front-end', items: frontend },
  { title: 'Back-end', items: backend },
  { title: 'Estilização', items: styling },
  { title: 'Banco de Dados (Relacional)', items: databasesRelational },
  { title: 'Banco de Dados (Não Relacional)', items: databasesNoSQL },
  { title: 'Mobile', items: mobile },
  { title: 'Ferramentas', items: Tools },
  { title: 'Outros', items: engineeringAndOtherStudies },
]

export const formations = [
  {
    title: 'Tecnólogo em Desenvolvimento Full Stack',
    value: 'Universidade Estácio de Sá',
  },
  {
    title: 'Bacharelado em Engenharia Civil',
    value: 'Centro Universitário - Unibra',
  },
]

export const formationsTec = [
  {
    title: 'Desenvolvedor Full Stack',
    value: 'Vai na Web',
  },
  {
    title: 'Desenvolvedor Front-end',
    value: 'Origamid',
  },
]
