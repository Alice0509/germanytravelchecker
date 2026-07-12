import {
  collectNoteSourceUrls,
  findSourceTrustErrors,
  isTrustedUrl,
  normalizeHost,
} from './eventPressureSourceTrust.js'

export function byId(items) {
  return new Map(items.map((item) => [item.id, item]))
}

export function isDifferent(a, b) {
  return JSON.stringify(a) !== JSON.stringify(b)
}

export function changedItems(baseItems, currentItems) {
  const baseMap = byId(baseItems)

  return currentItems.filter((item) => {
    const baseItem = baseMap.get(item.id)
    return !baseItem || isDifferent(baseItem, item)
  })
}

export function sourceRowsForItem(item, trustedHosts) {
  const urls = collectNoteSourceUrls(item)

  return urls.map((url) => ({
    url,
    host: normalizeHost(url),
    trusted: isTrustedUrl(url, trustedHosts),
  }))
}

export function buildSourceTrustItemBlock(item, trustedHosts, index) {
  const rows = sourceRowsForItem(item, trustedHosts)
  const trustedRows = rows.filter((row) => row.trusted)
  const untrustedRows = rows.filter((row) => !row.trusted)

  const lines = [
    `### ${index + 1}. ${item.city || '-'} · ${item.title || item.id || '(missing title)'}`,
    '',
    `- id: \`${item.id || '(missing id)'}\``,
    `- trusted source URLs: ${trustedRows.length}`,
    `- untrusted source URLs: ${untrustedRows.length}`,
    '',
  ]

  if (trustedRows.length > 0) {
    lines.push('Trusted URLs:', '')
    trustedRows.forEach((row) => lines.push(`- ${row.host}: ${row.url}`))
    lines.push('')
  }

  if (untrustedRows.length > 0) {
    lines.push('Untrusted URLs:', '')
    untrustedRows.forEach((row) => lines.push(`- ${row.host || 'invalid URL'}: ${row.url}`))
    lines.push('')
  }

  if (rows.length === 0) {
    lines.push('No source URLs found.', '')
  }

  return lines.join('\n')
}

export function buildSourceTrustMarkdown({ label, items, trustedHosts }) {
  const errors = findSourceTrustErrors(items, trustedHosts, label)

  const lines = [
    '## Source trust review',
    '',
    `- Scope: ${label}`,
    `- Trusted host count: ${trustedHosts.size}`,
    `- Review items: ${items.length}`,
    `- Source trust errors: ${errors.length}`,
    '',
  ]

  if (items.length === 0) {
    lines.push('No changed source-trust items to review.', '')
    return lines.join('\n')
  }

  items.forEach((item, index) => {
    lines.push(buildSourceTrustItemBlock(item, trustedHosts, index))
  })

  if (errors.length > 0) {
    lines.push('### Source trust errors', '')
    errors.forEach((error) => lines.push(`- ${error}`))
    lines.push('')
  }

  return lines.join('\n')
}
