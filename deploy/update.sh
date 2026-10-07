#!/usr/bin/env bash
# Rebuild and restart with zero manual steps:  bash deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
[ "${1:-}" = "--no-pull" ] || { [ -d .git ] && git pull --ff-only || true; }
npm ci --no-audit --no-fund
NODE_OPTIONS=--max-old-space-size=1536 npx next build
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save
