#!/bin/bash

# Script to clear Augment Code account caching
# This will remove all stored account information so users aren't logged in

echo "🧹 Augment Code Cache Cleaner 🧹"
echo "--------------------------------"

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Detected macOS system"
    VS_CODE_DIR="$HOME/Library/Application Support/Code/User"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo "Detected Linux system"
    VS_CODE_DIR="$HOME/.config/Code/User"
else
    # Windows or other - assume Windows
    echo "Detected Windows system"
    VS_CODE_DIR="$APPDATA/Code/User"
fi

echo "Looking for VS Code data in: $VS_CODE_DIR"

# Check if VS Code is running
if pgrep -x "Code" > /dev/null || pgrep -x "code" > /dev/null; then
    echo "⚠️ VS Code is currently running. Please close VS Code before continuing."
    echo "Press Enter to continue anyway (not recommended) or Ctrl+C to exit..."
    read -r
fi

# Clear globalStorage for Augment Code
AUGMENT_GLOBAL_DIR="$VS_CODE_DIR/globalStorage/augment.vscode-augment"
if [ -d "$AUGMENT_GLOBAL_DIR" ]; then
    echo "Found Augment Code global storage at: $AUGMENT_GLOBAL_DIR"
    echo "Removing Augment Code global storage..."
    rm -rf "$AUGMENT_GLOBAL_DIR"
    echo "✅ Augment Code global storage removed"
else
    echo "❓ Augment Code global storage not found at: $AUGMENT_GLOBAL_DIR"
fi

# Clear all workspaceStorage that might contain Augment data
WORKSPACE_STORAGE_DIR="$VS_CODE_DIR/workspaceStorage"
if [ -d "$WORKSPACE_STORAGE_DIR" ]; then
    echo "Found workspace storage at: $WORKSPACE_STORAGE_DIR"
    echo "Searching for Augment Code data in workspace storage..."
    
    # Find and remove Augment-related files in workspace storage
    find "$WORKSPACE_STORAGE_DIR" -type f -name "*augment*" -exec rm -f {} \;
    
    # Also look for state.vscdb files and clean Augment entries from them
    # This is more complex and would require SQLite operations
    # For simplicity, we'll just notify the user
    echo "Note: Some Augment data might still exist in workspace storage databases."
else
    echo "❓ Workspace storage not found at: $WORKSPACE_STORAGE_DIR"
fi

# Clear browser storage (this requires VS Code to be open with Developer Tools)
echo ""
echo "To completely clear browser storage:"
echo "1. Open VS Code"
echo "2. Press Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (macOS) to open Developer Tools"
echo "3. Go to the Application tab"
echo "4. Under Storage, select and clear:"
echo "   - Local Storage"
echo "   - Session Storage"
echo "   - Cookies"
echo "   - IndexedDB (if present)"

echo ""
echo "✅ Augment Code cache cleaning completed!"
echo "Next time you open VS Code, you should be logged out of Augment Code."
