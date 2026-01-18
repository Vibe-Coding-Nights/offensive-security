#!/bin/bash
# Workshop Prerequisites Check Script
# Run this before starting any workshop project

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "  AI Security Workshop - Preflight Check"
echo "=========================================="
echo ""

ERRORS=0

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -ge 18 ]; then
        echo -e "${GREEN}OK${NC} ($(node --version))"
    else
        echo -e "${YELLOW}WARNING${NC} ($(node --version) - need 18+)"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}MISSING${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check pnpm
echo -n "Checking pnpm... "
if command -v pnpm &> /dev/null; then
    echo -e "${GREEN}OK${NC} ($(pnpm --version))"
else
    echo -e "${YELLOW}MISSING${NC} (install: npm i -g pnpm)"
    ERRORS=$((ERRORS+1))
fi

# Check Docker
echo -n "Checking Docker... "
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo -e "${GREEN}OK${NC} (running)"
    else
        echo -e "${YELLOW}NOT RUNNING${NC} (start Docker Desktop)"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}MISSING${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check docker-compose
echo -n "Checking docker-compose... "
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}MISSING${NC}"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "=========================================="
echo "  Environment Variables"
echo "=========================================="
echo ""

# Check .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

echo -n "Checking .env file... "
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}OK${NC}"

    # Check GEMINI_API_KEY
    echo -n "  GEMINI_API_KEY... "
    if grep -q "^GEMINI_API_KEY=" "$ENV_FILE" && [ -n "$(grep '^GEMINI_API_KEY=' "$ENV_FILE" | cut -d= -f2)" ]; then
        echo -e "${GREEN}SET${NC}"
    else
        echo -e "${RED}MISSING${NC}"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}MISSING${NC}"
    echo "  Create .env with GEMINI_API_KEY=your_key"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "=========================================="
echo "  Project Directories"
echo "=========================================="
echo ""

# Check project directories exist
for project in hireflow memento devkit-mcp; do
    echo -n "Checking $project... "
    if [ -d "$SCRIPT_DIR/$project" ]; then
        echo -e "${GREEN}OK${NC}"
    else
        echo -e "${RED}MISSING${NC}"
        ERRORS=$((ERRORS+1))
    fi
done

echo ""
echo "=========================================="
echo "  Port Availability"
echo "=========================================="
echo ""

# Check common ports
for port in 5173 5432; do
    echo -n "Port $port... "
    if lsof -i :$port &> /dev/null; then
        echo -e "${YELLOW}IN USE${NC}"
    else
        echo -e "${GREEN}AVAILABLE${NC}"
    fi
done

echo ""
echo "=========================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Ready for workshop.${NC}"
    echo ""
    echo "Quick start:"
    echo "  cd hireflow && npm run setup && npm run dev"
    echo "  cd memento && pnpm install && pnpm dev"
    echo "  cd devkit-mcp && pnpm install && pnpm run build"
else
    echo -e "${RED}$ERRORS issue(s) found. Please fix before starting.${NC}"
    exit 1
fi
