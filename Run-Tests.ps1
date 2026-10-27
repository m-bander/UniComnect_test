$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw 'Install Node.js 24 or newer before running this script.' }
Push-Location (Join-Path $PSScriptRoot 'backend')
try { & $taskNode 'node_modules/@playwright/test/cli.js' 'test'; $taskTestExit = $LASTEXITCODE } finally { Pop-Location }
Write-Host 'Report: backend/qa/artifacts/html/index.html. A nonzero exit code indicates failed checks; see qa/DEFECTS.md.'
exit $taskTestExit
