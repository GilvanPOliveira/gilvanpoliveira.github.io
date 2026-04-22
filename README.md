# Gilvan Oliveira | Portfólio

Portfólio pessoal construído com Vue 3, Vite e Tailwind CSS para apresentar projetos, formação, trajetória profissional e formas de contato.

## Destaques

- navegação SPA com páginas de home, projetos, detalhe do projeto, sobre e contato
- integração com a API pública do GitHub para listar repositórios e carregar READMEs
- cache em `sessionStorage` para reduzir chamadas repetidas à API
- base de SEO técnico com metadados dinâmicos, `robots.txt`, `sitemap.xml` e JSON-LD
- melhorias de acessibilidade com landmarks, skip link, foco visível e suporte a `prefers-reduced-motion`
- layout responsivo com sidebar fixa, cartões semânticos e componentes reutilizáveis

## Stack

- Vue 3
- TypeScript
- Vue Router
- Vite
- Tailwind CSS

## Variáveis de ambiente

```env
VITE_GITHUB_USERNAME=seu_usuario_github
```

O projeto usa apenas o nome de usuário do GitHub. Não é recomendado expor tokens em aplicações client-side.

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

## Estrutura principal

```text
src/
|-- assets/
|-- components/
|-- composables/
|-- data/
|-- router/
|-- services/
|-- utils/
`-- views/
```

## Observações

- os projetos exibidos filtram forks, repositórios arquivados e o próprio repositório `.github.io`
- a página de contato usa link direto para agenda, evitando script externo no carregamento inicial
- a listagem de stacks usa ícones externos com fallback de texto caso algum asset não carregue

## Contato

- Site: https://gilvanpoliveira.github.io
- Email: [gilvanoliveira06@gmail.com](mailto:gilvanoliveira06@gmail.com)
- GitHub: https://github.com/GilvanPOliveira
- LinkedIn: https://www.linkedin.com/in/gilvanpoliveira/
