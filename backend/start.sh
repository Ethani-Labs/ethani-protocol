#!/bin/bash
# ETHANI Backend Start Script

echo "🚀 Starting ETHANI Pricing API..."
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

echo "📦 Checking dependencies..."

# Install requirements if needed
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "📥 Installing FastAPI and dependencies..."
    pip3 install -r requirements.txt
fi

echo ""
echo "✅ Starting server..."
echo ""
echo "🌐 API will be available at: http://localhost:8000"
echo "📖 Interactive docs at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the server from app directory
cd "$(dirname "$0")" || exit
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
