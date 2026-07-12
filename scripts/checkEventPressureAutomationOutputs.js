import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.replace('--mode=', '') : ''

const allowedByMode = {
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

if (!allowedByMode[mode]) {
  console.error('Usage: node scripts/checkEventPressureAutomationOutputs.js --mode=candidate|promotion')
  process.exit(1)
}

function parseStatusLine(line) {
  return line.slice(3).trim()
}

async function main() {
  const { stdout } = await execFileAsync('git', ['status', '--short'], {
    maxBuffer: 1024 * 1024 * 10,
  })

  const changedPaths = stdout
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .map(parseStatusLine)

  const allowed = allowedByMode[mode]
  const unexpected = changedPaths.filter((changedPath) => !allowed.has(changedPath))

  console.log('Event pressure automation output guard')
  console.log('======================================')
  console.log(`Mode: ${mode}`)
  console.log(`Changed paths: ${changedPaths.length}`)

  if (changedPaths.length > 0) {
    console.log('')
    changedPaths.forEach((changedPath) => {
      const label = allowed.has(changedPath) ? 'allowed' : 'unexpected'
      console.log(`- ${label}: ${changedPath}`)
    })
  }

  if (unexpected.length > 0) {
    console.log('')
    console.log('Unexpected output changes detected.')
    console.log('Only expected generated data/report files may change in write-mode automation.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
