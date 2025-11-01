#!/bin/bash

echo "🚀 Setting up Adaptive Chatbot Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found. Please ensure MongoDB is installed and running.${NC}"
else
    echo -e "${GREEN}✅ MongoDB detected${NC}"
fi

echo ""
echo "📦 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend dependencies installed${NC}"

echo ""
echo "📦 Installing frontend dependencies..."
cd Frontend
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend installation failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend dependencies installed${NC}"

cd ..

echo ""
echo "⚙️  Checking environment variables..."

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env and add your credentials:${NC}"
    echo "   - MONGODB_URI"
    echo "   - GEMINI_API_KEY"
    echo "   - JWT_SECRET"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Option 1 - Run both servers separately:"
echo "  Terminal 1: npm run dev         (Backend)"
echo "  Terminal 2: cd Frontend && npm run dev  (Frontend)"
echo ""
echo "Option 2 - Run both servers together:"
echo "  npm run dev:all"
echo ""
echo "🌐 Application URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:5000"
echo ""
echo "📚 Don't forget to:"
echo "  1. Start MongoDB: sudo systemctl start mongod"
echo "  2. Add your Gemini API key to .env"
echo "  3. Update JWT_SECRET in .env"
echo ""
echo "Happy coding! 🎉"
