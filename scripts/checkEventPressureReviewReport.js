import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.replace('--mode=', '') : ''

const configs = {
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

if (!configs[mode]) {
  console.error('Usage: node scripts/checkEventPressureReviewReport.js --mode=candidate|promotion')
  process.exit(1)
}

async function main() {
  const config = configs[mode]
  const reportPath = path.join(repoRoot, config.file)

  let body = ''
  try {
    body = await fs.readFile(reportPath, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Missing review report: ${config.file}`)
      process.exit(1)
    }
    throw error
  }

  const errors = []

  if (body.trim() === '') {
    errors.push(`${config.file} is empty.`)
  }

  for (const section of config.requiredSections) {
    if (!body.includes(section)) {
      errors.push(`${config.file} is missing required section: ${section}`)
    }
  }

  console.log('Event pressure review report guard')
  console.log('==================================')
  console.log(`Mode: ${mode}`)
  console.log(`File: ${config.file}`)
  console.log(`Required sections: ${config.requiredSections.length}`)
  console.log(`Errors: ${errors.length}`)

  if (errors.length > 0) {
    console.log('')
    errors.forEach((error) => console.log(`- ${error}`))
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
