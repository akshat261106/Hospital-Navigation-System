# Hospital Indoor Navigation System

A comprehensive full-stack web application for hospital indoor navigation, helping patients and visitors easily locate doctors, departments, facilities, and navigate through the hospital using interactive maps and pathfinding algorithms.

## Features

✅ **Interactive Hospital Map** - Visual representation of hospital layout
✅ **Smart Navigation** - Dijkstra's algorithm for shortest path finding
✅ **Hospital Services** - View all available services and departments
✅ **Facilities Locator** - Find hospital facilities (pharmacy, canteen, restrooms, etc.)
✅ **Real-time Search** - Search for locations, doctors, and services
✅ **Help & Support** - FAQs and contact information
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **User-Friendly UI** - Intuitive interface based on your provided designs

## Tech Stack

### Frontend
- **React** - Modern UI framework
- **React Router** - Client-side routing
- **Vite** - Fast build tooling
- **CSS3** - Responsive styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **CORS** - Cross-origin resource sharing

### Algorithms
- **Dijkstra's Algorithm** - Pathfinding
- **Graph Data Structure** - Hospital layout representation

## Project Structure

```
project/
├── server.js                 # Express backend server
├── package.json             # Root dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main app component
│   │   ├── App.css         # Global styles
│   │   ├── main.jsx        # Entry point
│   │   ├── index.css       # Base styles
│   │   ├── components/
│   │   │   ├── Header.jsx  # Navigation header
│   │   │   ├── Footer.jsx  # Footer component
│   │   │   └── HospitalMap.jsx  # Interactive map
│   │   ├── pages/
│   │   │   ├── Home.jsx    # Home page with search
│   │   │   ├── Services.jsx # Medical services
│   │   │   ├── Facilities.jsx # Hospital facilities
│   │   │   ├── Help.jsx    # Help & FAQs
│   │   │   ├── Location.jsx # Navigation interface
│   │   │   ├── Login.jsx   # User authentication
│   │   │   └── SignIn.jsx  # User registration
│   │   ├── styles/
│   │   │   ├── Home.css
│   │   │   ├── Services.css
│   │   │   ├── Facilities.css
│   │   │   ├── Help.css
│   │   │   ├── Location.css
│   │   │   └── Login.css
│   │   └── utils/
│   │       ├── data.js     # Static data (hospital graph)
│   │       └── pathfinder.js # Pathfinding algorithm
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── index.html              # Static HTML
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Install Root Dependencies
```bash
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Start the Backend Server
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on: **http://localhost:5000**

### Step 4: In a New Terminal, Start Frontend Development Server
```bash
npm run frontend-dev
```

The frontend will run on: **http://localhost:5173**

Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Locations
- `GET /api/locations` - Get all hospital locations
- `GET /api/location/:id` - Get specific location details
- `GET /api/graph` - Get complete hospital graph data

### Pathfinding
- `POST /api/find-path` - Find shortest path between two locations
  ```json
  {
    "startId": "reg-counter",
    "endId": "pharmacy"
  }
  ```

### Search
- `GET /api/search?q=query` - Search for locations

### Services
- `GET /api/services` - Get all medical services
- `GET /api/services/:id` - Get specific service

### Facilities
- `GET /api/facilities` - Get all hospital facilities
- `GET /api/facilities/:id` - Get specific facility

### Health
- `GET /api/health` - Server health check

## Hospital Data

The system includes predefined data for:
- **15+ Locations** - Departments, counters, junctions, wards
- **6 Medical Services** - Cardiology, Orthopedics, Neurology, Dermatology, Pediatrics, General Surgery
- **6 Facilities** - X-Ray, Lab, Pharmacy, Emergency, Canteen, Nursing Office

## Key Components

### Home Page
- Integrated search functionality
- Quick access to navigation
- Hospital information cards
- Hospital highlights section

### Location/Navigation Page
- Interactive hospital map
- Location selector
- Route visualization
- Step-by-step directions

### Services Page
- Display all hospital services
- Doctor information
- Department locations

### Facilities Page
- List of hospital facilities
- Location and status
- Emergency services info

### Help Page
- Frequently Asked Questions
- Contact information
- Hospital visit tips
- Multiple contact channels

## Algorithm Details

### Pathfinding Algorithm (Dijkstra's)
The backend uses Dijkstra's shortest path algorithm to find the most efficient route between any two locations in the hospital.

**Time Complexity:** O((V + E) log V) where V = vertices, E = edges
**Space Complexity:** O(V)

### Hospital Graph
- **Nodes:** Represent hospital locations (rooms, junctions, departments)
- **Edges:** Represent walkable paths with weighted distances
- **Weighted:** Distance-based weights for realistic navigation

## Features Implemented

✅ Real-time location search
✅ Interactive map with visual pathfinding
✅ Multiple hospital services catalog
✅ Facility locator system
✅ Help and support system
✅ Responsive design
✅ Backend API with pathfinding
✅ User authentication flow
✅ Error handling and validation
✅ CORS enabled for frontend-backend communication

## Building for Production

To build the frontend for production:
```bash
npm run build
```

This creates an optimized build in `frontend/dist/`

## Error Handling

The application includes:
- Network error handling
- Invalid pathfinding scenarios
- Missing data fallbacks
- User input validation
- API error responses

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- User authentication with JWT
- Real-time location tracking
- QR code scanning
- Voice navigation
- Multiple language support
- Appointment booking system
- Doctor availability
- Chat support

## Troubleshooting

### Backend not connecting
- Ensure port 5000 is available
- Check if backend is running: `http://localhost:5000/api/health`
- Check browser console for CORS errors

### Frontend showing blank
- Clear browser cache
- Check console for errors
- Ensure Vite dev server is running

### Navigation not working
- Verify both servers are running
- Check network activity in browser DevTools
- Ensure pathfinding algorithm is working

## Support

For issues or questions, please refer to:
1. Help page in the application
2. README files in respective directories
3. Code comments and documentation

## License

MIT License - Feel free to use for personal or commercial projects

## Contributors

Your Name - Full Stack Development

---

**Made with ❤️ for better hospital navigation**
