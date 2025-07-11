#!/bin/bash

echo "🚌 Setting up Perdoor Bus Timing Website..."
echo "==========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB first."
    echo "   You can also use MongoDB Atlas cloud database."
fi

echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   1. Make sure MongoDB is running"
echo "   2. Run: npm run dev"
echo ""
echo "📊 To add sample data:"
echo "   Make a POST request to: http://localhost:5000/api/buses/seed"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Made with ❤️ for the Perdoor community"