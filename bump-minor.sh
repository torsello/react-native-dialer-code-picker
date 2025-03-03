#!/bin/bash

set -e

CURRENT_VERSION=$(jq -r '.version' package.json)

MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)

NEW_PATCH=$((PATCH + 1))
NEW_VERSION="$MAJOR.$MINOR.$NEW_PATCH"

echo "🚀 Updating patch version from $CURRENT_VERSION to $NEW_VERSION..."

jq --arg newVersion "$NEW_VERSION" '.version = $newVersion' package.json > package.tmp.json && mv package.tmp.json package.json

if ! yarn prepare || ! yarn pack; then
  echo "❌ Error detected! Reverting to previous version $CURRENT_VERSION..."
  jq --arg oldVersion "$CURRENT_VERSION" '.version = $oldVersion' package.json > package.tmp.json && mv package.tmp.json package.json
  exit 1
fi

echo "✅ Successfully updated to $NEW_VERSION, prepared, and packed!"
