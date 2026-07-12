import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

const args = process.argv.slice(2)

const shouldWrite = args.includes('--write')
const candidateOnly = args.includes('--candidate-only')
const promoteOnly = args.includes('--promote-only')
const checkedAtArg = args.find((arg) => arg.startsWith('--checked-at='))
const limitArg = args.find((arg) => arg.startsWith('--limit='))

function run(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: 'inherit',
      shell: false,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${commandArgs.join(' ')} failed with exit code ${code}`))
      }
    })
  })
}

const reportOnlyOutputPaths = [
  'src/data/eventPressureCandidates.generated.json',
  'src/data/eventPressureNotes.generated.json',
  'event-pressure-candidate-report.md',
  'event-pressure-promotion-report.md',
]

async function assertReportOnlyOutputsClean() {
  const { stdout } = await execFileAsync('git', ['status', '--short', '--', ...reportOnlyOutputPaths], {
    maxBuffer: 1024 * 1024 * 10,
  })

  if (stdout.trim() === '') {
    return
  }

  console.log('')
  console.log('Report-only output changes detected')
  console.log('===================================')
  console.log(stdout.trim())

  await run('git', ['--no-pager', 'diff', '--', ...reportOnlyOutputPaths])

  throw new Error('Report-only pipeline must not change generated data or markdown report files. Use --write for output changes.')
}

async function runNode(script, scriptArgs = []) {
  await run('node', [script, ...scriptArgs])
}

function getModeLabel() {
  if (candidateOnly) return 'candidate-only'
  if (promoteOnly) return 'promote-only'
  return 'full'
}

async function runCandidateStage() {
  console.log('')
  console.log('Candidate stage')
  console.log('===============')

  const scanArgs = []
  if (shouldWrite) scanArgs.push('--write')
  if (limitArg) scanArgs.push(limitArg)

  await runNode('scripts/scanKnownEventSources.js', scanArgs)
  await runNode('scripts/discoverEventPressureCandidates.js')
  await runNode('scripts/reportEventPressureCandidates.js', shouldWrite ? ['--markdown'] : [])
}

async function runPromotionStage() {
  console.log('')
  console.log('Promotion stage')
  console.log('===============')

  const promoteArgs = []
  if (shouldWrite) promoteArgs.push('--write')
  if (checkedAtArg) promoteArgs.push(checkedAtArg)

  await runNode('scripts/promoteEventPressureCandidates.js', promoteArgs)
  await runNode('scripts/discoverEventPressureCandidates.js')
  await runNode('scripts/discoverEventPressure.js')
  await runNode('scripts/reportEventPressurePromotion.js', shouldWrite ? ['--markdown'] : [])
}

async function runSharedGuards() {
  console.log('')
  console.log('Shared guards')
  console.log('=============')

  await runNode('scripts/testEventPressureDateRangeSelection.js')
  await runNode('scripts/checkKnownEventProfiles.js')
  await runNode('scripts/checkKnownEventDates.js', ['--strict'])
  await runNode('scripts/checkExpiredEventPressureNotes.js', ['--strict'])
  await runNode('scripts/testEventPressureCopySafety.js')
  await runNode('scripts/checkEventPressureCopySafety.js')
  await runNode('scripts/testEventPressureCopySafetyReport.js')
  await runNode('scripts/testEventPressureSourceTrust.js')
  await runNode('scripts/checkEventPressureSourceTrust.js')
  await runNode('scripts/testEventPressureSourceTrustReport.js')
  await runNode('scripts/testEventPressureReviewReport.js')
  await runNode('scripts/reportEventPressure.js')
}

async function main() {
  if (candidateOnly && promoteOnly) {
    throw new Error('Use only one mode: --candidate-only or --promote-only.')
  }

  console.log('Event pressure automation pipeline')
  console.log('==================================')
  console.log(`Mode: ${getModeLabel()}`)
  console.log(`Write mode: ${shouldWrite ? 'yes' : 'no'}`)
  console.log(`Limit: ${limitArg ? limitArg.replace('--limit=', '') : 'none'}`)
  console.log(`Checked at: ${checkedAtArg ? checkedAtArg.replace('--checked-at=', '') : 'Germany current date'}`)

  if (!promoteOnly) {
    await runCandidateStage()
  }

  if (!candidateOnly) {
    await runPromotionStage()
  }

  await runSharedGuards()

  if (!shouldWrite) {
    await assertReportOnlyOutputsClean()
  }

  console.log('')
  console.log('Event pressure automation pipeline completed.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
