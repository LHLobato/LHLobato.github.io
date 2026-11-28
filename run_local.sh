#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================"
echo "  Portfólio Luís Henrique Lobato — Ambiente Local"
echo "  [TARDIS Telemetry: ONLINE | ECG Condition: FINE]"
echo "======================================================"

# Garante que as imagens em /assets (incluindo projeto1..4) estejam sincronizadas com public/assets
mkdir -p assets/projeto1 assets/projeto2 assets/projeto3 assets/projeto4
mkdir -p public/assets/projeto1 public/assets/projeto2 public/assets/projeto3 public/assets/projeto4
for img in assets/*.jpg assets/*.jpeg assets/*.png assets/*.webp assets/*.gif assets/*.svg; do
  if [ -f "$img" ]; then
    cp "$img" public/assets/
  fi
done
for dir in projeto1 projeto2 projeto3 projeto4; do
  for img in "assets/$dir"/*.jpg "assets/$dir"/*.jpeg "assets/$dir"/*.png "assets/$dir"/*.webp "assets/$dir"/*.gif "assets/$dir"/*.svg; do
    if [ -f "$img" ]; then
      cp "$img" "public/assets/$dir/"
    fi
  done
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
