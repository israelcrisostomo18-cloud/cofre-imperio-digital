$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

$NodeDir = Get-ChildItem -LiteralPath ".tools" -Directory -Filter "node-*-win-x64" |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $NodeDir) {
  throw "Node portatil nao encontrado em .tools. Rode a preparacao novamente."
}

$GlobalPrefix = Join-Path $ProjectRoot ".tools\npm-global"
$env:PATH = "$($NodeDir.FullName);$GlobalPrefix;$env:PATH"

Write-Host ""
Write-Host "1/4 Instalando dependencias..." -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "2/4 Rodando build..." -ForegroundColor Cyan
npm run build

Write-Host ""
Write-Host "3/4 Verificando Vercel CLI..." -ForegroundColor Cyan
if (-not (Test-Path (Join-Path $GlobalPrefix "vercel.cmd"))) {
  npm install -g vercel --prefix "$GlobalPrefix"
}
vercel --version

Write-Host ""
Write-Host "4/4 Login e deploy em producao..." -ForegroundColor Cyan
Write-Host "Quando a Vercel perguntar:" -ForegroundColor Yellow
Write-Host "- Set up and deploy? Responda Y"
Write-Host "- Which scope? Escolha sua conta"
Write-Host "- Link to existing project? Responda N se ainda nao existir"
Write-Host "- Project name: cofre-imperio-digital"
Write-Host "- Directory: ./"
Write-Host "- Override settings? Responda N"
Write-Host ""

vercel login
vercel --prod
