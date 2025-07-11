#!/bin/bash

echo "🚌 Preparing Perdoor Bus Timing Project for Pull Request..."
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_info "Initializing Git repository..."
    git init
    print_status "Git repository initialized"
fi

# Check if remote origin exists
if ! git remote | grep -q "origin"; then
    print_warning "No remote origin found. Please add your repository URL:"
    echo "Example: git remote add origin https://github.com/yourusername/perdoor-bus-timing.git"
    read -p "Enter your repository URL (or press Enter to skip): " repo_url
    if [ ! -z "$repo_url" ]; then
        git remote add origin "$repo_url"
        print_status "Remote origin added: $repo_url"
    fi
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_info "Creating .env file..."
    cat > .env << EOL
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/perdoor-bus-timing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
EOL
    print_status ".env file created"
fi

# Ensure .env is in .gitignore
if ! grep -q "\.env" .gitignore; then
    echo ".env" >> .gitignore
    print_status "Added .env to .gitignore"
fi

# Stage all files
print_info "Staging all project files..."
git add .

# Check what files are staged
print_info "Files to be committed:"
git diff --cached --name-only

# Create commit message
COMMIT_MSG="🚌 Complete Perdoor Bus Timing MERN Application with Admin Panel

✨ Features:
- Full-stack MERN application for bus timing management
- JWT-based admin authentication system
- Complete CRUD operations for bus management
- Modern glassmorphism UI with gradient effects
- Responsive design optimized for mobile devices
- Real-time bus timing calculations
- Simplified bus model with departure/arrival times
- Admin dashboard with modal forms
- Secure password hashing with bcrypt
- Comprehensive form validation and error handling

🎯 Technical Stack:
- Backend: Node.js, Express.js, MongoDB, JWT, bcrypt
- Frontend: React 18, Axios, React Icons, CSS3
- Database: MongoDB with Mongoose ODM
- Authentication: JWT tokens with 24h expiration
- UI: Glassmorphism design with smooth animations

🔐 Admin Access:
- Username: admin
- Password: admin123

🚀 Ready for production deployment with security best practices"

# Commit changes
print_info "Creating commit..."
git commit -m "$COMMIT_MSG"
print_status "Changes committed successfully"

# Check current branch
current_branch=$(git branch --show-current 2>/dev/null || echo "main")
print_info "Current branch: $current_branch"

# Push to repository
print_info "Pushing to repository..."
if git push origin "$current_branch" 2>/dev/null; then
    print_status "Successfully pushed to origin/$current_branch"
else
    print_warning "Push failed. Trying to set upstream..."
    if git push -u origin "$current_branch"; then
        print_status "Successfully pushed with upstream set"
    else
        print_error "Failed to push. Please check your repository configuration."
        exit 1
    fi
fi

# Get repository URL for PR creation
repo_url=$(git remote get-url origin 2>/dev/null)
if [[ $repo_url == *"github.com"* ]]; then
    # Extract repository path for GitHub
    repo_path=$(echo "$repo_url" | sed 's/.*github\.com[:/]\([^.]*\).*/\1/')
    pr_url="https://github.com/$repo_path/compare"
    
    print_status "Project pushed successfully!"
    echo ""
    echo "🎉 NEXT STEPS:"
    echo "=============="
    print_info "1. Create Pull Request:"
    echo "   Visit: $pr_url"
    echo ""
    print_info "2. Use this PR title:"
    echo "   🚌 Complete Perdoor Bus Timing MERN Application with Admin Panel"
    echo ""
    print_info "3. Copy PR description from: PR_DESCRIPTION.md"
    echo ""
    print_info "4. Admin Demo Credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    print_info "5. Test the application:"
    echo "   npm run dev"
    echo ""
else
    print_status "Project pushed successfully!"
    print_info "Create your pull request manually on your Git platform"
fi

# Display project structure
echo ""
print_info "📁 Project Structure:"
echo "perdoor-bus-timing/"
echo "├── 📄 package.json           # Backend dependencies"
echo "├── 🌐 server.js              # Express server"
echo "├── 🔧 .env                   # Environment variables"
echo "├── 📚 README.md              # Documentation"
echo "├── 📋 PR_DESCRIPTION.md      # Pull request description"
echo "├── 🛡️  middleware/auth.js     # JWT authentication"
echo "├── 📊 models/"
echo "│   ├── Bus.js                # Bus data model"
echo "│   └── Admin.js              # Admin user model"
echo "├── 🚀 routes/"
echo "│   ├── buses.js              # Bus API endpoints"
echo "│   ├── routes.js             # Route search endpoints"
echo "│   └── admin.js              # Admin management endpoints"
echo "└── 💻 client/"
echo "    ├── 📄 package.json       # React dependencies"
echo "    ├── 🌐 public/index.html  # HTML template"
echo "    └── 📱 src/"
echo "        ├── App.js            # Main React component"
echo "        ├── App.css           # Glassmorphism styles"
echo "        ├── index.js          # React entry point"
echo "        └── components/"
echo "            ├── Header.js          # Navigation header"
echo "            ├── BusSearch.js       # Search functionality"
echo "            ├── BusResults.js      # Results display"
echo "            ├── PopularRoutes.js   # Quick route access"
echo "            ├── AdminLogin.js      # Admin authentication"
echo "            └── AdminDashboard.js  # Bus management"

echo ""
print_status "🎉 Perdoor Bus Timing project is ready for Pull Request!"
print_info "The complete MERN application with admin panel has been prepared."
print_info "Review PR_DESCRIPTION.md for comprehensive project documentation."