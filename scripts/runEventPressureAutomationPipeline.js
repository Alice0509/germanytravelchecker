import { spawn } from 'node:child_process'

const shouldWrite = process.argv.includes('--write')
const checkedAtArg = process.argv.find((arg) => arg.startsWith('--checked-at='))
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed with exit code ${code}`))
      }
    })
  })
}

async function runNode(script, args = []) {
  await run('node', [script, ...args])
}

async function main() {
  console.log('Event pressure automation pipeline')
  console.log('==================================')
  console.log(`Write mode: ${shouldWrite ? 'yes' : 'no'}`)
  console.log(`Limit: ${limitArg ? limitArg.replace('--limit=', '') : 'none'}`)
  console.log(`Checked at: ${checkedAtArg ? checkedAtArg.replace('--checked-at=', '') : 'Germany current date'}`)
  console.log('')

  const scanArgs = []
  if (shouldWrite) scanArgs.push('--write')
  if (limitArg) scanArgs.push(limitArg)

  await runNode('scripts/scanKnownEventSources.js', scanArgs)
  await runNode('scripts/discoverEventPressureCandidates.js')
  await runNode('scripts/reportEventPressureCandidates.js', shouldWrite ? ['--markdown'] : [])

  const promoteArgs = []
  if (shouldWrite) promoteArgs.push('--write')
  if (checkedAtArg) promoteArgs.push(checkedAtArg)

  await runNode('scripts/promoteEventPressureCandidates.js', promoteArgs)
  await runNode('scripts/discoverEventPressureCandidates.js')
  await runNode('scripts/discoverEventPressure.js')
  await runNode('scripts/reportEventPressurePromotion.js', shouldWrite ? ['--markdown'] : [])

  await runNode('scripts/checkKnownEventDates.js', ['--strict'])
  await runNode('scripts/checkExpiredEventPressureNotes.js', ['--strict'])
  await runNode('scripts/reportEventPressure.js')

  console.log('')
  console.log('Event pressure automation pipeline completed.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
