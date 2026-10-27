$taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (-not $taskNode) { throw 'Install Node.js 24 or newer before running this script.' }
Push-Location (Join-Path $PSScriptRoot 'frontend')
try { & $taskNode 'node_modules/vite/bin/vite.js' '--host' 'localhost' '--port' '5173' '--strictPort' } finally { Pop-Location }
