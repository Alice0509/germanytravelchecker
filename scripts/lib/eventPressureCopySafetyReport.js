import {
  collectCopySafetyTextValues,
  findCopySafetyErrors,
} from './eventPressureCopySafety.js'

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

export function buildCopySafetyItemBlock(item, index) {
  const values = collectCopySafetyTextValues(item || {})

  const lines = [
    `### ${index + 1}. ${item.city || '-'} · ${item.title || item.id || '(missing title)'}`,
    '',
    `- id: \`${item.id || '(missing id)'}\``,
    `- checked text fields: ${values.length}`,
    '',
  ]

  if (values.length > 0) {
    lines.push('Checked fields:', '')
    values.forEach(({ field }) => lines.push(`- ${field}`))
    lines.push('')
  } else {
    lines.push('No checked copy fields found.', '')
  }

  return lines.join('\n')
}

export function buildCopySafetyMarkdown({ label, items }) {
  const errors = findCopySafetyErrors(items, label)

  const lines = [
    '## Copy safety review',
    '',
    `- Scope: ${label}`,
    `- Review items: ${items.length}`,
    `- Copy safety errors: ${errors.length}`,
    '',
  ]

  if (items.length === 0) {
    lines.push('No changed copy-safety items to review.', '')
    return lines.join('\n')
  }

  items.forEach((item, index) => {
    lines.push(buildCopySafetyItemBlock(item, index))
  })

  if (errors.length > 0) {
    lines.push('### Copy safety errors', '')
    errors.forEach((error) => lines.push(`- ${error}`))
    lines.push('')
  }

  return lines.join('\n')
}
