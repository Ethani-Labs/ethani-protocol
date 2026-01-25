#!/bin/bash

# ETHANI Local System Validation Script
# Checks all requirements before starting the system

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║           ETHANI Local System - Pre-Flight Validation                     ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASS=0
FAIL=0
WARN=0

# Test function
test_command() {
    local description=$1
    local command=$2
    local min_version=$3
    
    if command -v $command &> /dev/null; then
        version=$($command --version 2>&1 | head -1)
        echo -e "${GREEN}✅${NC} $description: $version"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} $description: NOT INSTALLED"
        ((FAIL++))
        return 1
    fi
}

# Test file existence
test_file() {
    local description=$1
    local filepath=$2
    
    if [ -f "$filepath" ]; then
        echo -e "${GREEN}✅${NC} $description exists"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} $description NOT FOUND: $filepath"
        ((FAIL++))
        return 1
    fi
}

# Test directory existence
test_dir() {
    local description=$1
    local dirpath=$2
    
    if [ -d "$dirpath" ]; then
        echo -e "${GREEN}✅${NC} $description directory exists"
        ((PASS++))
        return 0
    else
        echo -e "${RED}❌${NC} $description directory NOT FOUND: $dirpath"
        ((FAIL++))
        return 1
    fi
}

# Test network connectivity
test_network() {
    local description=$1
    local url=$2
    
    if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $description is reachable"
        ((PASS++))
        return 0
    else
        echo -e "${YELLOW}⚠️${NC} $description connection failed (might be offline)"
        ((WARN++))
        return 1
    fi
}

echo -e "${BLUE}📋 Checking Required Tools${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_command "Node.js" "node"
test_command "npm" "npm"
test_command "Python3" "python3"
test_command "Foundry" "forge"
test_command "Cargo" "cargo"
test_command "Cargo-Stylus" "cargo"

echo ""
echo -e "${BLUE}📁 Checking Project Structure${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_dir "Backend" "backend"
test_dir "Frontend" "frontend"
test_dir "Contracts" "contracts"
test_file "Backend requirements.txt" "backend/requirements.txt"
test_file "Backend .env" "backend/.env"
test_file "Frontend .env.local" "frontend/.env.local"
test_file "Backend config.py" "backend/app/config.py"
test_file "Backend main.py" "backend/app/main.py"

echo ""
echo -e "${BLUE}🔗 Checking Network Connectivity${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_network "Arbitrum Sepolia RPC" "https://sepolia-rollup.arbitrum.io/rpc"

echo ""
echo -e "${BLUE}📦 Checking Python Dependencies${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd backend
if [ -d "venv" ]; then
    echo -e "${GREEN}✅${NC} Python virtual environment exists"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️${NC} Python virtual environment NOT found"
    echo "   Run: cd backend && python3 -m venv venv"
    ((WARN++))
fi

# Try to import key packages
python3 << 'EOF' 2>/dev/null
import sys
try:
    import fastapi
    print("\033[0;32m✅\033[0m fastapi is installed")
except ImportError:
    print("\033[1;33m⚠️\033[0m fastapi not installed - run: pip install -r requirements.txt")
    
try:
    import web3
    print("\033[0;32m✅\033[0m web3 is installed")
except ImportError:
    print("\033[1;33m⚠️\033[0m web3 not installed - run: pip install -r requirements.txt")

try:
    import dotenv
    print("\033[0;32m✅\033[0m python-dotenv is installed")
except ImportError:
    print("\033[1;33m⚠️\033[0m python-dotenv not installed - run: pip install -r requirements.txt")
EOF

cd ..

echo ""
echo -e "${BLUE}🔧 Checking Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check backend config
cd backend
python3 << 'EOF' 2>/dev/null
from app.config import config
print("\033[0;32m✅\033[0m Backend config loads successfully")
print(f"   RPC: {config.BLOCKCHAIN_RPC_URL}")
print(f"   Chain: {config.BLOCKCHAIN_NETWORK} (ID: {config.ARBITRUM_CHAIN_ID})")
print(f"   Blockchain enabled: {config.BLOCKCHAIN_ENABLED}")
print(f"   Pricing contract: {config.ETHANI_PRICING_ADDRESS}")
EOF
cd ..

# Check frontend config
if grep -q "NEXT_PUBLIC_API_URL=http://localhost:8000" frontend/.env.local; then
    echo -e "${GREEN}✅${NC} Frontend API URL configured"
    ((PASS++))
else
    echo -e "${RED}❌${NC} Frontend API URL not configured correctly"
    ((FAIL++))
fi

if grep -q "NEXT_PUBLIC_RPC_URL=https://sepolia-rollup" frontend/.env.local; then
    echo -e "${GREEN}✅${NC} Frontend RPC configured for Arbitrum Sepolia"
    ((PASS++))
else
    echo -e "${RED}❌${NC} Frontend RPC not configured correctly"
    ((FAIL++))
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                          Validation Summary                               ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "  ${GREEN}Passed:${NC}   $PASS"
echo -e "  ${RED}Failed:${NC}   $FAIL"
echo -e "  ${YELLOW}Warnings:${NC} $WARN"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ System is ready for local development!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. cd backend && pip install -r requirements.txt"
    echo "  2. cd frontend && npm install"
    echo "  3. Run: ./start_local_system.sh"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Please fix the above issues before starting the system.${NC}"
    exit 1
fi
