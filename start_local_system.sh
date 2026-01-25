#!/bin/bash

# ETHANI Local System Startup Script
# Starts both Backend (FastAPI) and Frontend (Next.js)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to check if port is in use
port_in_use() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping ETHANI services...${NC}"
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    echo -e "${YELLOW}✅ Services stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Check if ports are available
echo -e "${BLUE}🔍 Checking port availability...${NC}"

if port_in_use 8000; then
    echo -e "${RED}❌ Port 8000 is already in use${NC}"
    echo "   Run: lsof -i :8000 to find the process"
    exit 1
fi

if port_in_use 3000; then
    echo -e "${RED}❌ Port 3000 is already in use${NC}"
    echo "   Run: lsof -i :3000 to find the process"
    exit 1
fi

echo -e "${GREEN}✅ Ports 8000 and 3000 are available${NC}"

# ============================================================================
# Backend Setup
# ============================================================================
echo ""
echo -e "${BLUE}📦 Setting up Backend (FastAPI)...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd backend

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $PYTHON_VERSION"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies silently
echo "Installing dependencies..."
pip install -q -r requirements.txt 2>/dev/null || {
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
}

# Verify configuration
echo "Verifying configuration..."
python3 << 'VERIFY_CONFIG'
try:
    from app.config import config
    print(f"  ✅ Config loaded")
    print(f"  ✅ RPC: {config.BLOCKCHAIN_RPC_URL}")
    print(f"  ✅ Blockchain: {config.BLOCKCHAIN_ENABLED}")
except Exception as e:
    print(f"  ❌ Config error: {e}")
    exit(1)
VERIFY_CONFIG

if [ $? -ne 0 ]; then
    exit 1
fi

# Start backend in background
echo "Starting Backend (port 8000)..."
python3 main.py > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is ready${NC}"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Backend failed to start${NC}"
        echo "Check logs: tail -f logs/backend.log"
        exit 1
    fi
    
    sleep 1
done

cd ..

# ============================================================================
# Frontend Setup
# ============================================================================
echo ""
echo -e "${BLUE}🎨 Setting up Frontend (Next.js)...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install > /dev/null 2>&1 || {
        echo -e "${RED}❌ Failed to install npm dependencies${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ npm dependencies installed${NC}"
else
    echo -e "${GREEN}✅ npm dependencies already installed${NC}"
fi

# Verify .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    exit 1
fi

# Start frontend in background
echo "Starting Frontend (port 3000)..."
npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Frontend is ready${NC}"
        break
    fi
    
    if [ $i -eq 30 ]; then
        echo -e "${RED}❌ Frontend failed to start${NC}"
        echo "Check logs: tail -f logs/frontend.log"
        exit 1
    fi
    
    sleep 1
done

cd ..

# ============================================================================
# System Ready
# ============================================================================
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 ETHANI Local System is Running!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo "📊 Frontend:"
echo "   URL: ${BLUE}http://localhost:3000${NC}"
echo "   Open in browser to view the dashboard"
echo ""
echo "📡 Backend API:"
echo "   URL: ${BLUE}http://localhost:8000${NC}"
echo "   Swagger UI: ${BLUE}http://localhost:8000/docs${NC}"
echo "   ReDoc: ${BLUE}http://localhost:8000/redoc${NC}"
echo ""
echo "🧪 Run Integration Tests:"
echo "   ${BLUE}cd backend && python3 test_integration.py${NC}"
echo ""
echo "📋 Environment:"
echo "   Backend PID: $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo "   Backend logs: tail -f logs/backend.log"
echo "   Frontend logs: tail -f logs/frontend.log"
echo ""
echo "🛑 To Stop:"
echo "   Press Ctrl+C"
echo ""

# Keep script running
wait
