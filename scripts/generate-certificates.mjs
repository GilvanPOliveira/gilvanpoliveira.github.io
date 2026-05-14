import { createSign } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const outputPath = resolve(rootDir, 'public/certificates.json')

loadDotEnv(resolve(rootDir, '.env'))

const folderId = process.env.GOOGLE_DRIVE_CERTIFICATES_FOLDER_ID || extractFolderId(process.env.GOOGLE_DRIVE_CERTIFICATES_FOLDER_URL || '')
const serviceAccount = loadServiceAccount()
const apiKey = process.env.GOOGLE_DRIVE_API_KEY || ''
const driveScope = 'https://www.googleapis.com/auth/drive.metadata.readonly'

function loadDotEnv(path) {
  try {
    const raw = readFileSync(path, 'utf8')

    raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .forEach((line) => {
        const [key, ...valueParts] = line.split('=')
        const value = valueParts.join('=').replace(/^["']|["']$/g, '')

        if (!process.env[key]) {
          process.env[key] = value
        }
      })
  } catch {
  }
}

function loadServiceAccount() {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
  const jsonPath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH

  try {
    if (rawJson) {
      return JSON.parse(rawJson)
    }

    if (jsonPath && existsSync(resolve(rootDir, jsonPath))) {
      return JSON.parse(readFileSync(resolve(rootDir, jsonPath), 'utf8'))
    }
  } catch (error) {
    console.warn(
      `[certificates] Credencial do Google Drive invalida (${error instanceof Error ? error.message : String(error)}).`,
    )
  }

  return null
}

function extractFolderId(value) {
  const match = value.match(/\/folders\/([a-zA-Z0-9_-]+)/)
  return match?.[1] || ''
}

function base64Url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function signJwt(payload, privateKey) {
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const body = base64Url(JSON.stringify(payload))
  const signatureInput = `${header}.${body}`
  const signature = createSign('RSA-SHA256').update(signatureInput).sign(privateKey, 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return `${signatureInput}.${signature}`
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000)
  const assertion = signJwt(
    {
      iss: serviceAccount.client_email,
      scope: driveScope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    },
    serviceAccount.private_key,
  )

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  })

  if (!response.ok) {
    throw new Error(`OAuth ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  return data.access_token
}

async function listDriveChildren(auth, parentId) {
  const children = []
  let pageToken = ''

  do {
    const params = new URLSearchParams({
      q: `'${parentId}' in parents and trashed = false`,
      fields: 'nextPageToken,files(id,name,description,mimeType,createdTime,modifiedTime)',
      orderBy: 'folder,name',
      pageSize: '100',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    })

    if (auth.apiKey) {
      params.set('key', auth.apiKey)
    }

    if (pageToken) {
      params.set('pageToken', pageToken)
    }

    const headers = auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : undefined
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, { headers })

    if (!response.ok) {
      throw new Error(`Drive API ${response.status}: ${await response.text()}`)
    }

    const data = await response.json()
    children.push(...(data.files || []))
    pageToken = data.nextPageToken || ''
  } while (pageToken)

  return children
}

async function listCertificateFiles(auth, parentId = folderId, parentPath = []) {
  const children = await listDriveChildren(auth, parentId)
  const files = []

  for (const child of children) {
    if (child.mimeType === 'application/vnd.google-apps.folder') {
      files.push(...(await listCertificateFiles(auth, child.id, [...parentPath, child.name])))
      continue
    }

    files.push({
      ...child,
      category: parentPath[0] || 'Diversos',
      folderPath: parentPath.join(' / '),
    })
  }

  return files
}

function decodeHtml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function extractDriveItemsFromHtml(html) {
  const decoded = decodeHtml(html)
  const chunks = decoded.split('[[null,"').slice(1)
  const items = []
  const seen = new Set()

  for (const chunk of chunks) {
    const id = chunk.match(/^([a-zA-Z0-9_-]{20,})"/)?.[1]
    const mimeType = chunk.match(/"(application\/vnd\.google-apps\.folder|application\/pdf|image\/[^"]+|[^"]+\/[^"]+)"/)?.[1]
    const name = chunk.match(/\[\[\["([^"]+)",null,true\]\]\]/)?.[1]

    if (!id || !mimeType || !name || seen.has(id)) {
      continue
    }

    seen.add(id)
    items.push({ id, name, mimeType, description: '' })
  }

  return items
}

async function listPublicFolderFiles(parentId = folderId, parentPath = []) {
  const response = await fetch(`https://drive.google.com/drive/folders/${parentId}?usp=sharing`)

  if (!response.ok) {
    throw new Error(`Drive public folder ${response.status}`)
  }

  const children = extractDriveItemsFromHtml(await response.text())
  const files = []

  for (const child of children) {
    if (child.mimeType === 'application/vnd.google-apps.folder') {
      files.push(...(await listPublicFolderFiles(child.id, [...parentPath, child.name])))
      continue
    }

    files.push({
      ...child,
      category: parentPath[0] || 'Diversos',
      folderPath: parentPath.join(' / '),
    })
  }

  return files
}

function stripExtension(name) {
  return name.replace(/\.[^.]+$/, '').trim()
}

function parseDescription(description = '') {
  return description
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.includes(':'))
    .reduce((metadata, line) => {
      const [key, ...valueParts] = line.split(':')
      metadata[key.trim().toLowerCase()] = valueParts.join(':').trim()
      return metadata
    }, {})
}

function parseFileName(name) {
  const [title = '', issuer = '', date = ''] = stripExtension(name)
    .split(/\s+-\s+/)
    .map((part) => part.trim())

  return { title, issuer, date }
}

function sanitizeText(value) {
  return String(value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseTags(value) {
  return String(value || '')
    .split(',')
    .map(sanitizeText)
    .filter(Boolean)
    .slice(0, 8)
}

function normalizeCertificate(file) {
  const filename = parseFileName(file.name)
  const description = parseDescription(file.description)
  const title = sanitizeText(description.title || description.titulo || filename.title)
  const issuer = sanitizeText(description.issuer || description.emissor || description.instituicao || filename.issuer || file.category)
  const date = sanitizeText(description.date || description.data || filename.date)
  const workload = sanitizeText(description.workload || description.carga || description['carga horaria'])
  const tags = parseTags(description.tags || description.stacks || description.stack)
  const category = sanitizeText(description.category || description.categoria || file.category)

  return {
    title: title || 'Certificado',
    category: category || 'Diversos',
    issuer,
    date,
    workload,
    tags,
  }
}

async function writeCertificates(certificates) {
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(
    outputPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: 'google-drive-metadata',
        certificates,
      },
      null,
      2,
    )}\n`,
  )
}

async function main() {
  if (!folderId) {
    console.warn('[certificates] Configuracao ausente. Nenhum certificado sera publicado.')
    await writeCertificates([])
    return
  }

  let files = []

  if (serviceAccount?.client_email && serviceAccount?.private_key) {
    const accessToken = await getAccessToken()
    files = await listCertificateFiles({ accessToken })
  } else if (apiKey) {
    files = await listCertificateFiles({ apiKey })
  } else {
    console.warn('[certificates] Sem credencial/API key. Tentando leitura publica da pasta compartilhada.')
    files = await listPublicFolderFiles()
  }

  const certificates = files
    .map(normalizeCertificate)
    .sort((a, b) => a.category.localeCompare(b.category, 'pt-BR') || a.title.localeCompare(b.title, 'pt-BR'))

  await writeCertificates(certificates)
  console.log(`[certificates] ${certificates.length} certificados gerados em ${outputPath}`)
}

main().catch((error) => {
  console.error(`[certificates] ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
