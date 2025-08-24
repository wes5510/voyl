#!/bin/bash

# Clean userData directory for fresh start
echo "Cleaning voyl userData directory..."
rm -rf ~/Library/Application\ Support/\@voyl/
echo "✅ Cleaned userData"

# Run dev server
echo "Starting development server..."
pnpm dev