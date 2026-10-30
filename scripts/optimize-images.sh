#!/usr/bin/env bash
# Resize travel photos for the static site (Next's image optimizer is unavailable with `output: export`).
# Usage: scripts/optimize-images.sh <source-dir> [dest-dir]
# Uses macOS `sips`, so no image dependencies are needed in package.json.
set -euo pipefail

src="${1:?usage: optimize-images.sh <source-dir> [dest-dir]}"
dest="${2:-public/travel}"
max_edge=1000
quality=60

mkdir -p "$dest"
shopt -s nullglob nocaseglob
for f in "$src"/*.jpg "$src"/*.jpeg; do
  base="$(basename "${f%.*}")"
  out="$dest/${base}.jpg"
  # Only ever downscale: `sips -Z` would upscale smaller originals.
  w="$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')"
  h="$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')"
  edge=$(( w > h ? w : h ))
  target=$(( edge > max_edge ? max_edge : edge ))
  sips -s format jpeg -s formatOptions "$quality" -Z "$target" "$f" --out "$out" >/dev/null
  printf '%-28s %6s KB -> %5s KB\n' "$base" "$(( $(stat -f%z "$f") / 1024 ))" "$(( $(stat -f%z "$out") / 1024 ))"
done
