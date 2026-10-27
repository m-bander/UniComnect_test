$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw 'Install Node.js 24 or newer before running this script.' }
Push-Location (Join-Path $PSScriptRoot 'backend')
try { & $taskNode 'node_modules/tsx/dist/cli.mjs' 'qa/start.ts' } finally { Pop-Location }
