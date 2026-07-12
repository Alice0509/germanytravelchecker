import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  findReviewReportErrors,
  getReviewReportConfig,
} from './lib/eventPressureReviewReport.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.replace('--mode=', '') : ''

const config = getReviewReportConfig(mode)

if (!config) {
  console.error('Usage: node scripts/checkEventPressureReviewReport.js --mode=candidate|promotion')
  process.exit(1)
}

async function main() {
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

  const errors = findReviewReportErrors(body, config)

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
