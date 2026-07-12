import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

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

const readOnlyOutputPaths = [
  'src/data/eventPressureCandidates.generated.json',
  'src/data/eventPressureNotes.generated.json',
  'event-pressure-candidate-report.md',
  'event-pressure-promotion-report.md',
]

async function assertAutomationCheckReadOnly() {
  const { stdout } = await execFileAsync('git', ['status', '--short', '--', ...readOnlyOutputPaths], {
    maxBuffer: 1024 * 1024 * 10,
  })

  if (stdout.trim() === '') {
    return
  }

  console.log('')
  console.log('Automation check output changes detected')
  console.log('=======================================')
  console.log(stdout.trim())

  await run('git', ['--no-pager', 'diff', '--', ...readOnlyOutputPaths])

  throw new Error('event-pressure:automation-check must be read-only. Generated data/report files should not change.')
}

async function runNpmScript(scriptName) {
  await run('npm', ['run', scriptName])
}

async function main() {
  console.log('Event pressure automation check')
  console.log('===============================')

  const scripts = [
    'event-pressure:date-extraction:test',
    'event-pressure:date-range-selection:test',
    'event-pressure:scan-preview:test',
    'event-pressure:promotion-eligibility:test',
    'event-pressure:source-scan-promotion-flow:test',
    'event-pressure:known-profiles',
    'event-pressure:known-dates:strict',
    'event-pressure:expired:strict',
    'event-pressure:copy-safety:test',
    'event-pressure:copy-safety:report:test',
    'event-pressure:copy-safety',
    'event-pressure:source-trust:test',
    'event-pressure:source-trust:report:test',
    'event-pressure:source-trust',
    'event-pressure:review-report:test',
    'event-pressure:copy-safety:report',
    'event-pressure:copy-safety:report:candidate',
    'event-pressure:copy-safety:report:promotion',
    'event-pressure:source-trust:report',
    'event-pressure:source-trust:report:candidate',
    'event-pressure:source-trust:report:promotion',
    'event-pressure:outputs:test',
    'event-pressure:auto-pipeline',
    'event-pressure:seed-candidates',
    'event-pressure:report',
  ]

  for (const scriptName of scripts) {
    console.log('')
    console.log(`Running ${scriptName}`)
    console.log('-'.repeat(`Running ${scriptName}`.length))
    await runNpmScript(scriptName)
  }

  await assertAutomationCheckReadOnly()

  console.log('')
  console.log('Event pressure automation check passed.')
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
