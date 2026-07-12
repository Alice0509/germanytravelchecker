import { spawn } from 'node:child_process'

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

  await runNode('scripts/checkKnownEventDates.js', ['--strict'])
  await runNode('scripts/checkExpiredEventPressureNotes.js', ['--strict'])
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

  console.log('')
  console.log('Event pressure automation pipeline completed.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
