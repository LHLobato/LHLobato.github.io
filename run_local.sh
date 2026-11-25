#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================"
echo "  Portfólio Luís Henrique Lobato — Ambiente Local"
echo "  [TARDIS Telemetry: ONLINE | ECG Condition: FINE]"
echo "======================================================"

# Garante que as imagens em /assets estejam sincronizadas com public/assets
mkdir -p public/assets
for img in assets/*.jpg assets/*.jpeg assets/*.png assets/*.webp; do
  if [ -f "$img" ]; then
    cp "$img" public/assets/
  fi
done

# Extrai automaticamente os artigos e vínculos do PDF do Lattes em /assets
if command -v python3 >/dev/null 2>&1; then
  echo "-> Sincronizando artigos científicos a partir do PDF do Lattes em /assets..."
  python3 scripts/extract_lattes.py
fi

if [ ! -d "node_modules" ]; then
  echo "-> Instalando dependências com npm..."
  npm install
fi

echo "-> Iniciando servidor local de desenvolvimento..."
npm run dev -- --host
