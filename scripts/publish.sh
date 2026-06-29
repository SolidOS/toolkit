#!/bin/bash
set -e

hash=$(git rev-parse HEAD)
packagespacing=$(head -n 2 package.json | tail -n 1 | grep -o -E "^\s+")
current_version=$(grep -Po "(?<=\"version\"\: \")\d.\d.\d(?=\")" < package.json)
new_version="$current_version-dev.$hash"

sed -i "s/^$packagespacing\"version\"\: \"$current_version\"/$packagespacing\"version\"\: \"$new_version\"/" package.json

vp run build
npm publish --no-git-checks --tag dev
