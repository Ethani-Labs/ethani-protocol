#!/bin/bash
# ETHANI Stylus Contract Build Script

set -e

echo "🔨 Building ETHANI Stylus Contract..."

# Check for Rust
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo not found. Install Rust from https://rustup.rs/"
    exit 1
fi

# Check for Stylus CLI
if ! command -v cargo-stylus &> /dev/null; then
    echo "📦 Installing Stylus CLI..."
    cargo install --force cargo-stylus
fi

echo "✅ Rust: $(rustc --version)"
echo "✅ Cargo: $(cargo --version)"
echo "✅ Stylus CLI installed"

# Build for WASM
echo ""
echo "🔨 Compiling to WASM..."
cargo stylus build --release

echo ""
echo "✅ Build complete!"
echo ""
echo "Contract details:"
echo "  Network: Arbitrum Sepolia"
echo "  Target: WASM (WebAssembly)"
echo "  Compiler: Rust 1.93.0"
echo ""
echo "Next steps:"
echo "  1. Deploy: cargo stylus deploy --endpoint <RPC>"
echo "  2. Verify: cargo stylus verify --endpoint <RPC> --contract <ADDRESS>"
