<#
.SYNOPSIS
    Build the Lambda deployment directory that Terraform zips (Windows).

.DESCRIPTION
    Installs LINUX wheels (manylinux2014 / cp312) even though you are on
    Windows, so pydantic-core's compiled extension matches the Lambda runtime.
    Run this BEFORE `terraform apply`, and again whenever backend code or
    dependencies change.
#>
$ErrorActionPreference = 'Stop'

$here    = $PSScriptRoot
$backend = Join-Path $here '..\..\backend'
$build   = Join-Path $here 'build'
$dist    = Join-Path $here 'dist'

Write-Host '>> Cleaning build dir' -ForegroundColor Cyan
if (Test-Path $build) { Remove-Item -Recurse -Force $build }
New-Item -ItemType Directory -Force -Path $build | Out-Null
New-Item -ItemType Directory -Force -Path $dist  | Out-Null

Write-Host '>> Installing Linux-compatible dependencies' -ForegroundColor Cyan
python -m pip install `
    --platform manylinux2014_x86_64 `
    --implementation cp `
    --python-version 3.12 `
    --only-binary=:all: `
    --upgrade `
    --target $build `
    -r (Join-Path $backend 'requirements-lambda.txt')
if ($LASTEXITCODE -ne 0) { throw "pip install failed ($LASTEXITCODE)" }

Write-Host '>> Copying application code' -ForegroundColor Cyan
Copy-Item -Recurse -Force (Join-Path $backend 'app') (Join-Path $build 'app')

Write-Host ">> Done. Build dir ready at: $build" -ForegroundColor Green
Write-Host '   Next: terraform init && terraform apply'
