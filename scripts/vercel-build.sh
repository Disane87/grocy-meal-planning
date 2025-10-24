#!/bin/bash

echo "🚀 Starting Vercel build with Release Notes generation..."

# Get current git commit info
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MESSAGE=$(git log -1 --pretty=%B)

echo "📝 Commit: $COMMIT_HASH - $COMMIT_MESSAGE"

# Check if package.json version should be updated
if [[ "$COMMIT_MESSAGE" == *"feat:"* ]] || [[ "$COMMIT_MESSAGE" == *"fix:"* ]] || [[ "$COMMIT_MESSAGE" == *"feat("* ]] || [[ "$COMMIT_MESSAGE" == *"fix("* ]]; then
  echo "🔄 Significant changes detected, updating version..."
  
  # Auto-increment version based on commit type
  if [[ "$COMMIT_MESSAGE" == *"BREAKING CHANGE"* ]] || [[ "$COMMIT_MESSAGE" == *"!:"* ]]; then
    echo "💥 Breaking change detected - incrementing major version"
    npm version major --no-git-tag-version --no-commit-hooks
  elif [[ "$COMMIT_MESSAGE" == *"feat:"* ]] || [[ "$COMMIT_MESSAGE" == *"feat("* ]]; then
    echo "✨ Feature detected - incrementing minor version"
    npm version minor --no-git-tag-version --no-commit-hooks
  else
    echo "🐛 Fix detected - incrementing patch version"
    npm version patch --no-git-tag-version --no-commit-hooks
  fi
else
  echo "📝 No significant changes, keeping current version"
fi

# Get current version after potential update
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Building version: $CURRENT_VERSION"

# Update environment files with current version
echo "🔧 Updating environment files with version $CURRENT_VERSION..."
sed -i "s/version: '[^']*'/version: '$CURRENT_VERSION'/" src/environments/environment.ts
sed -i "s/version: '[^']*'/version: '$CURRENT_VERSION'/" src/environments/environment.prod.ts

# Generate release notes
echo "📋 Generating release notes..."
npm run generate-release-notes

# Build the application
echo "🏗️  Building application..."
npm run build

echo "✅ Build completed successfully!"