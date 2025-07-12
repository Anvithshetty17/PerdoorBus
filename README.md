# Perdoor Bus Timing App

A modern, mobile-friendly bus timing application for travelers in Perdoor, Kerala.

## Features

### For Users
- **Mobile-First Design**: Optimized for mobile devices with attractive UI
- **Real-time Bus Search**: Find buses to your destination
- **Popular Routes**: Quick access to frequently traveled routes
- **Live Timing**: See arrival times and bus status

### For Admins
- **Simplified Management**: Easy-to-use admin interface
- **Quick Bus Addition**: Add buses with just 4 fields:
  - Bus Name
  - Route (destination)
  - Arrival Time
  - Active Status
- **Secure Access**: Admin panel accessible via `/admin` URL

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd perdoor-bus-timing
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/perdoor-bus-timing
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend server
   npm start
   
   # In another terminal, start frontend
   cd client && npm start
   ```

5. **Access the application**
   - **User Interface**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin

## Admin Access

### Default Credentials
- **Username**: `admin`
- **Password**: `admin123`

### Admin Features
- **Add New Bus**: Click "Add New Bus" button
- **Edit Bus**: Click the edit icon on any bus card
- **Delete Bus**: Click the delete icon on any bus card
- **Toggle Status**: Use the checkbox to activate/deactivate buses

### Admin Form Fields
The admin interface has been simplified to only require:
1. **Bus Name** - The name of the bus service
2. **Route** - The destination (e.g., "Thiruvananthapuram")
3. **Arrival Time** - When the bus arrives at the destination
4. **Active Status** - Whether the bus is currently operating

## Mobile-First Design

The application is designed with mobile users in mind:
- **Responsive Layout**: Works perfectly on all screen sizes
- **Touch-Friendly**: Large buttons and easy navigation
- **Fast Loading**: Optimized for mobile networks
- **Modern UI**: Clean, attractive design with smooth animations

## API Endpoints

### Public Endpoints
- `GET /api/buses/route/:route` - Search buses by route
- `GET /api/routes` - Get all available routes

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `GET /api/admin/buses` - Get all buses
- `POST /api/admin/buses` - Add new bus
- `PUT /api/admin/buses/:id` - Update bus
- `DELETE /api/admin/buses/:id` - Delete bus

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication

### Frontend
- **React.js** - UI library
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Styling with mobile-first approach

## Deployment

### Production Setup
1. Set `NODE_ENV=production` in your environment
2. Build the React app: `cd client && npm run build`
3. The server will automatically serve the built files

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

---

**Note**: This application is specifically designed for the Perdoor bus service and has been optimized for mobile users with a simplified admin interface for easy management.