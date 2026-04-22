import { siteConfig } from '../data/site'

type SeoOptions = {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string) {
  let meta = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attribute, key)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

function upsertCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null

  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }

  link.href = url
}

export function applySeo(options: SeoOptions = {}) {
  if (typeof document === 'undefined') {
    return
  }

  const title = options.title ?? siteConfig.defaultTitle
  const description = options.description ?? siteConfig.defaultDescription
  const path = options.path ?? '/'
  const type = options.type ?? 'website'
  const canonicalUrl = new URL(path, siteConfig.url).toString()
  const imageUrl = new URL(options.image ?? siteConfig.socialImagePath, siteConfig.url).toString()

  document.title = title
  document.documentElement.lang = siteConfig.locale

  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', 'index,follow,max-image-preview:large')
  upsertMeta('name', 'theme-color', '#050816')

  upsertMeta('property', 'og:site_name', siteConfig.name)
  upsertMeta('property', 'og:locale', siteConfig.ogLocale)
  upsertMeta('property', 'og:type', type)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', canonicalUrl)
  upsertMeta('property', 'og:image', imageUrl)
  upsertMeta('property', 'og:image:alt', `Prévia do portfólio de ${siteConfig.name}`)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', imageUrl)

  upsertCanonical(canonicalUrl)
}
