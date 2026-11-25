#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "======================================================"
echo "  Portfólio L. H. Lobato — Ambiente de Teste Local"
echo "  [TARDIS Telemetry: ONLINE | ECG Condition: FINE]"
echo "======================================================"

# Garante que a imagem de perfil em /assets esteja sincronizada com public/assets
mkdir -p public/assets
if [ -f "assets/perfil.jpg" ]; then
  cp assets/perfil.jpg public/assets/perfil.jpg
fi

if [ ! -d "node_modules" ]; then
  echo "-> Instalando dependências com npm..."
  npm install
fi

echo "-> Iniciando servidor local de desenvolvimento..."
npm run dev -- --host
