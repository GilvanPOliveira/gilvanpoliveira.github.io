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

function normalizeCertificate(certificate: Certificate): Certificate {
  return {
    title: certificate.title || 'Certificado',
    category: certificate.category || 'Diversos',
    issuer: certificate.issuer || '',
    date: certificate.date || '',
    workload: certificate.workload || '',
    tags: Array.isArray(certificate.tags) ? certificate.tags : [],
  }
}

export async function fetchCertificates(): Promise<Certificate[]> {
  try {
    const response = await fetch(`/certificates.json?updatedAt=${Date.now()}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as CertificatesStaticData
    return Array.isArray(data.certificates) ? data.certificates.map(normalizeCertificate) : []
  } catch {
    return []
  }
}
