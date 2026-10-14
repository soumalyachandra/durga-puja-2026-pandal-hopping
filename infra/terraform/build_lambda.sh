#!/usr/bin/env bash
#
# Build the Lambda deployment directory that Terraform zips.
#
# Installs LINUX wheels (manylinux2014 / cp312) even when you run this on
# Windows or macOS, so pydantic-core's compiled extension matches the Lambda
# runtime. Run this BEFORE `terraform apply`, and again whenever backend code
# or dependencies change.
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$HERE/../../backend"
BUILD="$HERE/build"

echo ">> Cleaning build dir"
rm -rf "$BUILD"
mkdir -p "$BUILD" "$HERE/dist"

echo ">> Installing Linux-compatible dependencies"
python -m pip install \
  --platform manylinux2014_x86_64 \
  --implementation cp \
  --python-version 3.12 \
  --only-binary=:all: \
  --upgrade \
  --target "$BUILD" \
  -r "$BACKEND/requirements-lambda.txt"

echo ">> Copying application code"
cp -r "$BACKEND/app" "$BUILD/app"

echo ">> Done. Build dir ready at: $BUILD"
echo "   Next: terraform init && terraform apply"
