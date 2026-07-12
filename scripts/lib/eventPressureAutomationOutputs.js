export const allowedAutomationOutputsByMode = {
  candidate: new Set([
    'src/data/eventPressureCandidates.generated.json',
    'event-pressure-candidate-report.md',
  ]),
  promotion: new Set([
    'src/data/eventPressureNotes.generated.json',
    'src/data/eventPressureCandidates.generated.json',
    'event-pressure-promotion-report.md',
  ]),
}

export function getAllowedAutomationOutputs(mode) {
  return allowedAutomationOutputsByMode[mode] || null
}

export function parseGitStatusPath(line) {
  const rawPath = String(line || '').slice(3).trim()

  if (rawPath.includes(' -> ')) {
    return rawPath.split(' -> ').at(-1).trim()
  }

  return rawPath
}

export function parseGitStatusPaths(stdout) {
  return String(stdout || '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map(parseGitStatusPath)
}

export function findUnexpectedAutomationOutputs(changedPaths, mode) {
  const allowed = getAllowedAutomationOutputs(mode)

  if (!allowed) {
    throw new Error('Mode must be candidate or promotion.')
  }

  return changedPaths.filter((changedPath) => !allowed.has(changedPath))
}
