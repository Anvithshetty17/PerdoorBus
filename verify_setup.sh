#!/bin/bash

echo "🔍 Verifying Perdoor Bus Timing Project Setup..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_fail() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Initialize counters
pass_count=0
fail_count=0
total_checks=0

# Function to check if file exists
check_file() {
    total_checks=$((total_checks + 1))
    if [ -f "$1" ]; then
        print_pass "File exists: $1"
        pass_count=$((pass_count + 1))
        return 0
    else
        print_fail "File missing: $1"
        fail_count=$((fail_count + 1))
        return 1
    fi
}

# Function to check if directory exists
check_dir() {
    total_checks=$((total_checks + 1))
    if [ -d "$1" ]; then
        print_pass "Directory exists: $1"
        pass_count=$((pass_count + 1))
        return 0
    else
        print_fail "Directory missing: $1"
        fail_count=$((fail_count + 1))
        return 1
    fi
}

# Function to check package.json dependencies
check_dependency() {
    if grep -q "\"$1\"" package.json; then
        print_pass "Dependency found: $1"
        pass_count=$((pass_count + 1))
    else
        print_fail "Dependency missing: $1"
        fail_count=$((fail_count + 1))
    fi
    total_checks=$((total_checks + 1))
}

echo ""
print_info "📋 Checking Project Structure..."
echo "================================="

# Check root files
check_file "package.json"
check_file "server.js"
check_file ".gitignore"
check_file "README.md"
check_file "ADMIN_FEATURES.md"
check_file "PR_DESCRIPTION.md"

# Check backend directories and files
check_dir "models"
check_file "models/Bus.js"
check_file "models/Admin.js"

check_dir "routes"
check_file "routes/buses.js"
check_file "routes/routes.js"
check_file "routes/admin.js"

check_dir "middleware"
check_file "middleware/auth.js"

# Check frontend structure
check_dir "client"
check_file "client/package.json"
check_dir "client/src"
check_file "client/src/App.js"
check_file "client/src/App.css"
check_file "client/src/index.js"

check_dir "client/src/components"
check_file "client/src/components/Header.js"
check_file "client/src/components/BusSearch.js"
check_file "client/src/components/BusResults.js"
check_file "client/src/components/PopularRoutes.js"
check_file "client/src/components/AdminLogin.js"
check_file "client/src/components/AdminDashboard.js"

check_dir "client/public"
check_file "client/public/index.html"

echo ""
print_info "📦 Checking Backend Dependencies..."
echo "==================================="

# Check backend dependencies
check_dependency "express"
check_dependency "mongoose"
check_dependency "cors"
check_dependency "dotenv"
check_dependency "moment"
check_dependency "bcryptjs"
check_dependency "jsonwebtoken"
check_dependency "nodemon"
check_dependency "concurrently"

echo ""
print_info "🔒 Checking Security Configuration..."
echo "===================================="

# Check .env file
total_checks=$((total_checks + 1))
if [ -f ".env" ]; then
    print_pass ".env file exists"
    pass_count=$((pass_count + 1))
    
    # Check if .env contains required variables
    if grep -q "JWT_SECRET" .env; then
        print_pass "JWT_SECRET configured"
        pass_count=$((pass_count + 1))
    else
        print_fail "JWT_SECRET missing from .env"
        fail_count=$((fail_count + 1))
    fi
    total_checks=$((total_checks + 1))
    
    if grep -q "MONGODB_URI" .env; then
        print_pass "MONGODB_URI configured"
        pass_count=$((pass_count + 1))
    else
        print_fail "MONGODB_URI missing from .env"
        fail_count=$((fail_count + 1))
    fi
    total_checks=$((total_checks + 1))
else
    print_fail ".env file missing"
    fail_count=$((fail_count + 1))
    print_warning "Run: create_pr.sh to create .env file"
fi

# Check if .env is in .gitignore
total_checks=$((total_checks + 1))
if [ -f ".gitignore" ] && grep -q "\.env" .gitignore; then
    print_pass ".env is in .gitignore"
    pass_count=$((pass_count + 1))
else
    print_fail ".env not in .gitignore (security risk)"
    fail_count=$((fail_count + 1))
fi

echo ""
print_info "🎨 Checking Frontend Dependencies..."
echo "===================================="

# Check client dependencies
cd client 2>/dev/null
if [ $? -eq 0 ]; then
    if [ -f "package.json" ]; then
        # Check frontend dependencies
        if grep -q "\"react\"" package.json; then
            print_pass "React dependency found"
            pass_count=$((pass_count + 1))
        else
            print_fail "React dependency missing"
            fail_count=$((fail_count + 1))
        fi
        total_checks=$((total_checks + 1))
        
        if grep -q "\"axios\"" package.json; then
            print_pass "Axios dependency found"
            pass_count=$((pass_count + 1))
        else
            print_fail "Axios dependency missing"
            fail_count=$((fail_count + 1))
        fi
        total_checks=$((total_checks + 1))
        
        if grep -q "\"react-icons\"" package.json; then
            print_pass "React Icons dependency found"
            pass_count=$((pass_count + 1))
        else
            print_fail "React Icons dependency missing"
            fail_count=$((fail_count + 1))
        fi
        total_checks=$((total_checks + 1))
    fi
    cd ..
fi

echo ""
print_info "🚀 Checking NPM Scripts..."
echo "=========================="

# Check if npm scripts are configured
total_checks=$((total_checks + 1))
if grep -q "\"dev\":" package.json; then
    print_pass "Development script configured"
    pass_count=$((pass_count + 1))
else
    print_fail "Development script missing"
    fail_count=$((fail_count + 1))
fi

total_checks=$((total_checks + 1))
if grep -q "\"start\":" package.json; then
    print_pass "Start script configured"
    pass_count=$((pass_count + 1))
else
    print_fail "Start script missing"
    fail_count=$((fail_count + 1))
fi

echo ""
print_info "📊 Verification Summary"
echo "======================="
echo ""
echo "Total Checks: $total_checks"
echo -e "Passed: ${GREEN}$pass_count${NC}"
echo -e "Failed: ${RED}$fail_count${NC}"

# Calculate success percentage
if [ $total_checks -gt 0 ]; then
    success_rate=$(( (pass_count * 100) / total_checks ))
    echo "Success Rate: $success_rate%"
    echo ""
    
    if [ $success_rate -ge 95 ]; then
        print_pass "🎉 Project is ready for Pull Request!"
        echo ""
        print_info "Next steps:"
        echo "1. Run: chmod +x create_pr.sh && ./create_pr.sh"
        echo "2. Create Pull Request on your Git platform"
        echo "3. Use PR_DESCRIPTION.md for PR description"
        echo ""
        print_info "To test locally:"
        echo "npm run dev"
    elif [ $success_rate -ge 80 ]; then
        print_warning "⚠️  Project has minor issues but may work"
        echo ""
        print_info "Consider fixing failed checks before creating PR"
    else
        print_fail "❌ Project has major issues - fix before creating PR"
        echo ""
        print_info "Please address the failed checks above"
    fi
else
    print_fail "No checks performed"
fi

echo ""
print_info "🔧 Quick Fixes:"
echo "==============="
echo "• Missing .env: Run ./create_pr.sh"
echo "• Missing dependencies: npm install && cd client && npm install"
echo "• Missing files: Check if you're in the right directory"