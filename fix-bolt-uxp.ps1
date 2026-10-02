# fix-bolt-uxp.ps1
# Run this from INSIDE your Bolt UXP project folder
# (the folder that has package.json, vite.config.js / uxp.config.ts)
#
# Usage: right-click this file -> "Run with PowerShell"
# or: powershell -ExecutionPolicy Bypass -File .\fix-bolt-uxp.ps1

Write-Host "== Bolt UXP fixer ==" -ForegroundColor Cyan

# 0. Sanity check: are we in a Bolt UXP project?
if (-not (Test-Path ".\package.json")) {
    Write-Host "ERROR: No package.json found here." -ForegroundColor Red
    Write-Host "cd into your project folder first, then run this script again."
    exit 1
}

# 1. Free hot-reload port (prefer configured port, then common fallbacks)
Write-Host "`nStep 1: Freeing hot-reload ports..." -ForegroundColor Yellow
$ports = @(8081, 8080, 8082)
foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        $ids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $ids) {
            $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
            $name = if ($proc) { $proc.ProcessName } else { "?" }
            Write-Host "  Port $port held by $name ($procId). Attempting kill..."
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    } else {
        Write-Host "  Port $port is free."
    }
}
Start-Sleep -Seconds 1

# 2. Disable hybrid addon in uxp.config (the real switch — not vite hybrid:true)
Write-Host "`nStep 2: Disabling hybrid addon in uxp.config..." -ForegroundColor Yellow
$uxpConfig = ".\uxp.config.ts"
if (Test-Path $uxpConfig) {
    $content = Get-Content $uxpConfig -Raw
    $before = $content
    $content = $content -replace 'enableAddon:\s*true', 'enableAddon: false'
    # Comment out addon block if present and not already commented
    $content = $content -replace '(?m)^(\s*)addon:\s*\{[\s\S]*?\n\1\},', ''
    if ($content -ne $before) {
        Set-Content -Path $uxpConfig -Value $content -NoNewline
        Write-Host "  Patched $uxpConfig"
    } else {
        Write-Host "  No hybrid flags needed patching (already off or absent)."
    }
}

$targets = @(".\vite.config.js", ".\vite.config.ts", ".\manifest.json", ".\package.json")
foreach ($file in $targets) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $before = $content
        $content = $content -replace 'hybrid:\s*true', 'hybrid: false'
        $content = $content -replace '"hybrid":\s*true', '"hybrid": false'
        if ($content -ne $before) {
            Set-Content -Path $file -Value $content -NoNewline
            Write-Host "  Patched hybrid flag in $file"
        }
    }
}

# 3. Delete broken dist output
Write-Host "`nStep 3: Clearing old dist folder..." -ForegroundColor Yellow
if (Test-Path ".\dist") {
    Remove-Item ".\dist" -Recurse -Force
    Write-Host "  Removed dist/"
} else {
    Write-Host "  No dist folder to remove."
}

Write-Host "`nDone. Now run:  npm run dev" -ForegroundColor Green
Write-Host "If port 8080 is still locked by AgentService, use hotReloadPort: 8081 in uxp.config.ts." -ForegroundColor DarkGray
