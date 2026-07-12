import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const result = spawnSync('node', ['scripts/scanKnownEventSources.js'], {
  encoding: 'utf8',
})

assert.equal(result.status, 0, result.stderr || result.stdout)

const output = result.stdout

assert.match(output, /Known event source scan/)
assert.match(output, /Review candidates from scan: \d+/)
assert.match(output, /Review candidate preview/)
assert.match(output, /dates:/)
assert.match(output, /confidence:/)
assert.match(output, /source:/)
assert.match(output, /Report only\. Re-run with --write/)

console.log('Known source scan candidate preview smoke test passed.')
