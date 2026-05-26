param(
  [Parameter(Mandatory = $true)]
  [string]$Bucket,
  [Parameter(Mandatory = $false)]
  [string]$Endpoint = "https://storage.yandexcloud.net"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $env:YC_ACCESS_KEY_ID) {
  throw "Environment variable YC_ACCESS_KEY_ID is required."
}

if (-not $env:YC_SECRET_ACCESS_KEY) {
  throw "Environment variable YC_SECRET_ACCESS_KEY is required."
}

Write-Host "Building project..." -ForegroundColor Cyan
npm run build

if (-not (Test-Path -LiteralPath "dist")) {
  throw "dist directory was not created."
}

Write-Host "Uploading versioned assets..." -ForegroundColor Cyan
python -m awscli s3 sync dist/assets "s3://$Bucket/assets" `
  --endpoint-url "$Endpoint" `
  --delete `
  --cache-control "public,max-age=31536000,immutable"

Write-Host "Uploading app shell..." -ForegroundColor Cyan
python -m awscli s3 sync dist "s3://$Bucket" `
  --endpoint-url "$Endpoint" `
  --delete `
  --exclude "assets/*" `
  --cache-control "no-cache,no-store,must-revalidate"

Write-Host ""
Write-Host "Deploy completed." -ForegroundColor Green
Write-Host "Website URL: http://$Bucket.website.yandexcloud.net"
Write-Host "Mirror URL:  http://website.yandexcloud.net/$Bucket/"
