import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import {
  findUnexpectedAutomationOutputs,
  getAllowedAutomationOutputs,
  parseGitStatusPaths,
} from './lib/eventPressureAutomationOutputs.js'

const execFileAsync = promisify(execFile)

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.replace('--mode=', '') : ''
const allowed = getAllowedAutomationOutputs(mode)

if (!allowed) {
  console.error('Usage: node scripts/checkEventPressureAutomationOutputs.js --mode=candidate|promotion')
  process.exit(1)
}

async function main() {
  const { stdout } = await execFileAsync('git', ['status', '--short'], {
    maxBuffer: 1024 * 1024 * 10,
  })

  const changedPaths = parseGitStatusPaths(stdout)
  const unexpected = findUnexpectedAutomationOutputs(changedPaths, mode)

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
