# Perdoor Bus Timing Website

A full-stack MERN (MongoDB, Express, React, Node.js) application for bus timing management in Perdoor. This application helps travelers find the next available buses to their destinations with real-time timing calculations.

## 🚌 Features

- **Route Search**: Search for buses by destination with autocomplete suggestions
- **Real-time Timing**: Calculate and display next upcoming buses based on current time
- **Bus Information**: Complete details including fare, duration, bus type, and frequency
- **Popular Routes**: Quick access to frequently traveled destinations
- **Responsive Design**: Modern, mobile-friendly interface
- **Time-based Filtering**: Show only upcoming buses with time until departure
- **Urgent Alerts**: Special notifications for buses leaving soon

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Moment.js** - Date/time manipulation

### Frontend
- **React** - UI framework
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Modern styling with gradients and animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd perdoor-bus-timing
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/perdoor-bus-timing
```

### 5. Start MongoDB
Ensure MongoDB is running on your system.

### 6. Seed the database (optional)
To add sample bus data, make a POST request to:
```
POST http://localhost:5000/api/buses/seed
```

## 🏃‍♂️ Running the Application

### Development Mode (Recommended)
Run both backend and frontend simultaneously:
```bash
npm run dev
```

### Separate Commands
Run backend only:
```bash
npm run server
```

Run frontend only:
```bash
npm run client
```

### Production Build
```bash
npm run build
npm start
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 📊 Database Schema

### Bus Model
```javascript
{
  busName: String,        // Name of the bus service
  busNumber: String,      // Bus registration number
  route: String,          // Destination route
  departureTime: String,  // Departure time (HH:MM format)
  frequency: Number,      // Frequency in minutes (optional)
  operatingDays: [String], // Days of operation
  busType: String,        // Type: Ordinary, Deluxe, AC, Volvo, Private
  fare: Number,           // Ticket fare
  duration: String,       // Journey duration
  isActive: Boolean       // Active status
}
```

## 🔌 API Endpoints

### Bus Routes
- `GET /api/buses/route/:routeName` - Get buses for a specific route
- `GET /api/buses/routes` - Get all available routes
- `POST /api/buses` - Add a new bus
- `POST /api/buses/seed` - Add sample data

### Route Management
- `GET /api/routes/search/:query` - Search routes by name
- `GET /api/routes/popular` - Get popular routes

## 💡 Usage

1. **Search for Buses**: Enter your destination in the search box
2. **View Results**: See upcoming buses sorted by departure time
3. **Next Bus Indicator**: The first result shows the next available bus
4. **Route Suggestions**: Get autocomplete suggestions while typing
5. **Popular Routes**: Click on popular destinations for quick access
6. **Time Information**: View departure time and time until departure

## 🎨 Design Features

- **Modern UI**: Clean, gradient-based design with glassmorphism effects
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects and smooth transitions
- **Color-coded Bus Types**: Different colors for various bus categories
- **Time-based Alerts**: Visual indicators for urgent departures

## 🔧 Customization

### Adding New Routes
1. Use the `/api/buses` POST endpoint to add new buses
2. Or directly insert into MongoDB using the Bus schema

### Modifying Bus Types
Update the `busType` enum in `models/Bus.js`:
```javascript
busType: {
  type: String,
  enum: ['Ordinary', 'Deluxe', 'AC', 'Volvo', 'Private', 'NewType'],
  default: 'Ordinary'
}
```

### Styling Changes
Modify `client/src/App.css` for visual customizations.

## 🚀 Deployment

### Local Production
```bash
npm run build
npm start
```

### Cloud Deployment (Heroku)
1. Set environment variables in Heroku dashboard
2. Connect to MongoDB Atlas
3. Push to Heroku repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Enhancements

- Real-time bus tracking with GPS
- User authentication and favorites
- Bus booking functionality
- Push notifications for departures
- Admin dashboard for bus management
- Multi-language support
- Payment integration

---

**Made with ❤️ for the Perdoor community**