export type Certificate = {
  title: string
  category: string
  issuer: string
  date: string
  workload: string
  tags: string[]
}

type CertificatesStaticData = {
  generatedAt?: string
  certificates?: Certificate[]
}

export async function fetchCertificates(): Promise<Certificate[]> {
  try {
    const response = await fetch('/certificates.json', {
      cache: 'no-cache',
    })

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as CertificatesStaticData
    return Array.isArray(data.certificates) ? data.certificates : []
  } catch {
    return []
  }
}
