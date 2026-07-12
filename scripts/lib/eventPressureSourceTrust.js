export function normalizeHost(urlValue) {
  try {
    const host = new URL(String(urlValue)).hostname.toLowerCase()
    return host.startsWith('www.') ? host.slice(4) : host
  } catch {
    return ''
  }
}

export function collectUrlsFromValue(value) {
  const urls = []

  if (!value) return urls

  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value)) {
      urls.push(value)
    }
    return urls
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      urls.push(...collectUrlsFromValue(item))
    }
    return urls
  }

  if (typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      if (typeof child === 'string' && /(^url$|url$)/i.test(key) && /^https?:\/\//i.test(child)) {
        urls.push(child)
      } else {
        urls.push(...collectUrlsFromValue(child))
      }
    }
  }

  return urls
}

export function buildTrustedHosts(sourceCollections) {
  const hosts = new Set()

  for (const collection of sourceCollections) {
    for (const url of collectUrlsFromValue(collection)) {
      const host = normalizeHost(url)
      if (host) hosts.add(host)
    }
  }

  return hosts
}

export function isTrustedUrl(url, trustedHosts) {
  const host = normalizeHost(url)
  if (!host) return false

  for (const trustedHost of trustedHosts) {
    if (host === trustedHost || host.endsWith(`.${trustedHost}`)) {
      return true
    }
  }

  return false
}

export function collectNoteSourceUrls(note) {
  const urls = []

  if (typeof note?.sourceUrl === 'string') {
    urls.push(note.sourceUrl)
  }

  if (Array.isArray(note?.verifyLinks)) {
    for (const link of note.verifyLinks) {
      if (typeof link?.url === 'string') {
        urls.push(link.url)
      }
    }
  }

  if (Array.isArray(note?.sources)) {
    urls.push(...collectUrlsFromValue(note.sources))
  }

  return [...new Set(urls)]
}

export function findSourceTrustErrors(items, trustedHosts, label = 'items') {
  const errors = []

  if (!Array.isArray(items)) {
    return [`${label}: expected array`]
  }

  for (const item of items) {
    const id = item?.id || '(missing id)'
    const urls = collectNoteSourceUrls(item)
    const trustedUrls = urls.filter((url) => isTrustedUrl(url, trustedHosts))

    if (urls.length === 0) {
      errors.push(`${label} · ${id}: missing source URL. Add sourceUrl or verifyLinks[].url.`)
      continue
    }

    if (trustedUrls.length === 0) {
      errors.push(`${label} · ${id}: no trusted source URL found. URLs: ${urls.join(', ')}`)
    }
  }

  return errors
}
