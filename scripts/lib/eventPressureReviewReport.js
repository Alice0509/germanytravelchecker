export const reviewReportConfigs = {
  candidate: {
    file: 'event-pressure-candidate-report.md',
    requiredSections: [
      '# Event pressure candidate review',
      '## Copy safety review',
      '## Source trust review',
    ],
  },
  promotion: {
    file: 'event-pressure-promotion-report.md',
    requiredSections: [
      '# Event pressure promotion review',
      '## Copy safety review',
      '## Source trust review',
    ],
  },
}

export function getReviewReportConfig(mode) {
  return reviewReportConfigs[mode] || null
}

export function findReviewReportErrors(body, config) {
  const errors = []

  if (typeof body !== 'string') {
    return ['Review report body must be a string.']
  }

  if (body.trim() === '') {
    errors.push(`${config.file} is empty.`)
  }

  for (const section of config.requiredSections) {
    if (!body.includes(section)) {
      errors.push(`${config.file} is missing required section: ${section}`)
    }
  }

  return errors
}
