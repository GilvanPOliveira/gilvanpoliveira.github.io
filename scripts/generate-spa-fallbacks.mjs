import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const distDir = 'dist'
const indexPath = join(distDir, 'index.html')
const staticRoutes = ['sobre', 'projetos', 'contato']

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html nao encontrado. Execute o build antes de gerar as rotas.')
}

for (const route of staticRoutes) {
  const routeDir = join(distDir, route)

  mkdirSync(routeDir, { recursive: true })
  copyFileSync(indexPath, join(routeDir, 'index.html'))
}
