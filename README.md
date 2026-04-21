# Portfolio

Portfólio pessoal desenvolvido para apresentar projetos, stack principal e trajetória profissional, com integração direta à API do GitHub.

## Sobre

Aplicação web construída como vitrine técnica, permitindo visualizar repositórios reais, acessar detalhes dos projetos e manter o portfólio sempre atualizado a partir do GitHub.

O projeto foi desenvolvido com foco em clareza visual, organização de interface e integração com dados externos.

## Objetivo

Consolidar conhecimentos em desenvolvimento frontend e integração com APIs, incluindo:

- componentização
- responsividade
- consumo de API externa
- organização de interface
- navegação entre páginas
- integração com dados reais

## Funcionalidades

### Estrutura do portfólio

- página inicial com apresentação
- seção de projetos
- página de detalhe do projeto
- seção sobre
- seção de contato

### Integração com GitHub

- listagem de repositórios públicos
- ordenação por atualização
- leitura de README por projeto
- acesso ao repositório no GitHub
- acesso ao deploy quando disponível

### Navegação

- seleção de projeto
- paginação de repositórios
- navegação entre projetos
- acesso à página detalhada

### Responsividade

- adaptação para desktop, tablet e mobile
- ajuste de layout em telas pequenas
- leitura do README apenas em telas maiores
- botão de acesso ao README no mobile

## Variáveis de ambiente

O projeto utiliza variáveis para integração com a API do GitHub.

```env
VITE_GITHUB_USERNAME=seu_usuario_github
VITE_GITHUB_TOKEN=seu_token_github
```

### Variáveis

- `VITE_GITHUB_USERNAME`: usuário do GitHub utilizado na busca
- `VITE_GITHUB_TOKEN`: token pessoal para autenticação e aumento do limite da API

## Estrutura do repositório

```text
portfolio/
|-- public/
|-- src/
|   |-- components/
|   |-- router/
|   |-- services/
|   |-- views/
|   |-- App.vue
|   `-- main.ts
|-- .env.example
|-- package.json
|-- tailwind.config.js
|-- tsconfig.json
`-- vite.config.ts
```

## Como executar

```bash
git clone <url-do-repositorio>
cd portfolio
npm install
```

Crie o `.env` a partir do `.env.example`.

### Exemplo de `.env`

```env
VITE_GITHUB_USERNAME=seu_usuario_github
VITE_GITHUB_TOKEN=seu_token_github
```

Execute:

```bash
npm run dev
```

## Como testar

1. configurar o `.env` com usuário e token do GitHub
2. iniciar o projeto localmente
3. acessar a página de projetos
4. validar listagem dos repositórios
5. abrir um projeto específico
6. verificar leitura do README
7. testar comportamento responsivo

## Stack

[![My Skills](https://skillicons.dev/icons?i=vue,ts,vite,tailwind,github&perline=5)](https://skillicons.dev)

- Vue 3
- TypeScript
- Vite
- Tailwind CSS
- GitHub API

## Contato

- Portfolio: https://gilvanpoliveira.github.io
- Email: [gilvanoliveira06@gmail.com](mailto:gilvanoliveira06@gmail.com)
- GitHub: https://github.com/GilvanPOliveira
- LinkedIn: https://www.linkedin.com/in/gilvan-oliveira
