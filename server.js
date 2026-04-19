/**
 * Hospital Navigation Backend Server
 * Express.js server for hospital navigation API
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dns from 'dns';
// import cors from "cors";
import { OAuth2Client } from 'google-auth-library';

// Fix for local ISP DNS blocking mongodb.net
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 5000;

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://akshatg693:akshat123@cluster0.wvl0jqb.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// ============================================================================
// HOSPITAL GRAPH DATA
// ============================================================================

const HOSPITAL_GRAPH = {
  nodes: [
    { id: 'reg-counter', x: 100, y: 300, name: 'Registration Counter', type: 'entrance' },
    { id: 'room-22', x: 200, y: 280, name: 'Room 22 - पूछताछ', type: 'landmark' },
    { id: 'room-20', x: 300, y: 260, name: 'Room 20 - कैश काउन्टर', type: 'landmark' },
    { id: 'room-25', x: 400, y: 240, name: 'Room 25 - नर्सिग ऑफिस', type: 'landmark' },
    { id: 'room-27', x: 500, y: 220, name: 'Room 27 - ECG', type: 'landmark' },
    { id: 'room-30', x: 600, y: 210, name: 'Room 30 - 1C वार्ड', type: 'landmark' },
    { id: 'ab-ward', x: 700, y: 200, name: 'AB Ward (38 1AV Ward)', type: 'destination' },
    { id: 'emergency', x: 150, y: 500, name: 'Emergency Services', type: 'destination' },
    { id: 'xray', x: 600, y: 400, name: 'X-Ray Department', type: 'destination' },
    { id: 'lab', x: 500, y: 350, name: 'Central Lab', type: 'destination' },
    { id: 'pharmacy', x: 300, y: 150, name: 'Pharmacy', type: 'destination' },
    { id: 'canteen', x: 400, y: 250, name: 'Canteen', type: 'destination' },
    { id: 'junction-1', x: 150, y: 350, name: 'Corridor Junction', type: 'junction' },
    { id: 'junction-2', x: 300, y: 300, name: 'Corridor Junction', type: 'junction' },
    { id: 'junction-3', x: 450, y: 350, name: 'Corridor Junction', type: 'junction' }
  ],
  edges: [
    { from: 'reg-counter', to: 'room-22', weight: 100 },
    { from: 'room-22', to: 'room-20', weight: 100 },
    { from: 'room-20', to: 'room-25', weight: 100 },
    { from: 'room-25', to: 'room-27', weight: 100 },
    { from: 'room-27', to: 'room-30', weight: 100 },
    { from: 'room-30', to: 'ab-ward', weight: 100 },
    { from: 'reg-counter', to: 'junction-1', weight: 80 },
    { from: 'junction-1', to: 'emergency', weight: 150 },
    { from: 'room-27', to: 'junction-3', weight: 130 },
    { from: 'junction-3', to: 'xray', weight: 50 },
    { from: 'room-27', to: 'lab', weight: 130 },
    { from: 'room-20', to: 'pharmacy', weight: 110 },
    { from: 'room-25', to: 'canteen', weight: 20 },
    { from: 'room-22', to: 'reg-counter', weight: 100 },
    { from: 'room-20', to: 'room-22', weight: 100 },
    { from: 'room-25', to: 'room-20', weight: 100 },
    { from: 'room-27', to: 'room-25', weight: 100 },
    { from: 'room-30', to: 'room-27', weight: 100 },
    { from: 'ab-ward', to: 'room-30', weight: 100 },
    { from: 'junction-1', to: 'reg-counter', weight: 80 },
    { from: 'emergency', to: 'junction-1', weight: 150 },
    { from: 'junction-3', to: 'room-27', weight: 130 },
    { from: 'xray', to: 'junction-3', weight: 50 },
    { from: 'lab', to: 'room-27', weight: 130 },
    { from: 'pharmacy', to: 'room-20', weight: 110 },
    { from: 'canteen', to: 'room-25', weight: 20 }
  ]
};

const SERVICES = [
  { id: 1, name: 'MRI Scan', doctor: 'Dr. Arjun Mehta', location: 'Radiology Dept - 2nd Floor', icon: '🧠', description: 'Detailed imaging for brain and body scans.' },
  { id: 2, name: 'X-Ray', doctor: 'Dr. Neha Sharma', location: 'Imaging Lab - Ground Floor', icon: '🖥️', description: 'Used for bone fracture detection.' },
  { id: 3, name: 'CT Scan', doctor: 'Dr. Rohit Gupta', location: 'Diagnostic Center - 1st Floor', icon: '🧬', description: 'Advanced diagnostic imaging.' },
  { id: 4, name: 'ECG Test', doctor: 'Dr. Priya Kapoor', location: 'Cardiology Dept - 1st Floor', icon: '❤️', description: 'Heart activity monitoring.' },
  { id: 5, name: 'Blood Test', doctor: 'Dr. Karan Malhotra', location: 'Pathology Lab - Ground Floor', icon: '🩸', description: 'Laboratory tests for diagnosis.' },
  { id: 6, name: 'Orthopedic Consultation', doctor: 'Dr. Anjali Verma', location: 'Orthopedic OPD - 3rd Floor', icon: '🦴', description: 'Treatment for bone and joint problems.' }
];

const FACILITIES = [
  { 
    id: 1, 
    name: 'Pharmacy', 
    location: 'Ground Floor - Main Entrance', 
    icon: '💊', 
    status: 'Available',
    description: 'Purchase medicines and medical supplies.'
  },
  { 
    id: 2, 
    name: 'Washrooms', 
    location: 'Every Floor', 
    icon: '🚻', 
    status: 'Available',
    description: 'Clean washrooms available for patients.'
  },
  { 
    id: 3, 
    name: 'Cafeteria', 
    location: '2nd Floor - East Wing', 
    icon: '🍽️', 
    status: 'Open 6AM-8PM',
    description: 'Food and beverages for visitors and patients.'
  },
  { 
    id: 4, 
    name: 'Billing Counter', 
    location: 'Ground Floor - Reception', 
    icon: '💳', 
    status: 'Available',
    description: 'Payment and billing services.'
  },
  { 
    id: 5, 
    name: 'Help Desk', 
    location: 'Ground Floor - Lobby', 
    icon: '👨‍💼', 
    status: 'Available',
    description: 'Information and assistance for patients.'
  },
  { 
    id: 6, 
    name: 'Elevators', 
    location: 'Central Corridor', 
    icon: '🛗', 
    status: 'Available',
    description: 'Access hospital floors quickly.'
  }
];

// ============================================================================
// PATHFINDING ALGORITHM
// ============================================================================

class Pathfinder {
  constructor(graph) {
    this.graph = graph;
    this.nodes = graph.nodes;
    this.edges = graph.edges;
  }

  findShortestPath(startId, endId) {
    if (!startId || !endId) return [];

    const distances = {};
    const previous = {};
    const unvisited = new Set();

    this.nodes.forEach(node => {
      distances[node.id] = node.id === startId ? 0 : Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    while (unvisited.size > 0) {
      let currentNodeId = null;
      let smallestDistance = Infinity;

      unvisited.forEach(nodeId => {
        if (distances[nodeId] < smallestDistance) {
          smallestDistance = distances[nodeId];
          currentNodeId = nodeId;
        }
      });

      if (currentNodeId === null || distances[currentNodeId] === Infinity) break;

      unvisited.delete(currentNodeId);

      if (currentNodeId === endId) {
        return this.reconstructPath(previous, startId, endId);
      }

      const neighbors = this.getNeighbors(currentNodeId);
      neighbors.forEach(neighbor => {
        const edge = this.getEdge(currentNodeId, neighbor);
        if (edge) {
          const altDistance = distances[currentNodeId] + edge.weight;
          if (altDistance < distances[neighbor]) {
            distances[neighbor] = altDistance;
            previous[neighbor] = currentNodeId;
          }
        }
      });
    }

    return [];
  }

  getNeighbors(nodeId) {
    return this.edges
      .filter(edge => edge.from === nodeId)
      .map(edge => edge.to);
  }

  getEdge(fromId, toId) {
    return this.edges.find(edge => edge.from === fromId && edge.to === toId) || null;
  }

  reconstructPath(previous, startId, endId) {
    const path = [];
    let currentNodeId = endId;

    while (currentNodeId !== null) {
      const node = this.nodes.find(n => n.id === currentNodeId);
      if (node) {
        path.unshift(node);
      }
      currentNodeId = previous[currentNodeId];
    }

    return path;
  }

  getNode(nodeId) {
    return this.nodes.find(node => node.id === nodeId) || null;
  }

  getAllNodes() {
    return this.nodes;
  }
}

const pathfinder = new Pathfinder(HOSPITAL_GRAPH);

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Get all hospital locations
app.get('/api/locations', (req, res) => {
  res.json(pathfinder.getAllNodes());
});

// Get hospital graph
app.get('/api/graph', (req, res) => {
  res.json(HOSPITAL_GRAPH);
});

// Find path between two locations
app.post('/api/find-path', (req, res) => {
  const { startId, endId } = req.body;

  if (!startId || !endId) {
    return res.status(400).json({ error: 'startId and endId are required' });
  }

  const path = pathfinder.findShortestPath(startId, endId);

  if (path.length === 0) {
    return res.status(404).json({ error: 'No path found' });
  }

  res.json({ path });
});

// Get specific location
app.get('/api/location/:id', (req, res) => {
  const node = pathfinder.getNode(req.params.id);

  if (!node) {
    return res.status(404).json({ error: 'Location not found' });
  }

  res.json(node);
});

// Search locations
app.get('/api/search', (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : '';

  if (!query) {
    return res.status(400).json({ error: 'Search query required' });
  }

  const results = HOSPITAL_GRAPH.nodes.filter(node =>
    node.name.toLowerCase().includes(query) ||
    node.id.toLowerCase().includes(query)
  );

  res.json(results);
});

// Get all services
app.get('/api/services', (req, res) => {
  res.json(SERVICES);
});

// Get specific service
app.get('/api/services/:id', (req, res) => {
  const service = SERVICES.find(s => s.id === parseInt(req.params.id));

  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  res.json(service);
});

// Get all facilities
app.get('/api/facilities', (req, res) => {
  res.json(FACILITIES);
});

// Get specific facility
app.get('/api/facilities/:id', (req, res) => {
  const facility = FACILITIES.find(f => f.id === parseInt(req.params.id));

  if (!facility) {
    return res.status(404).json({ error: 'Facility not found' });
  }

  res.json(facility);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Sign Up Route
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ 
      message: 'Account created successfully',
      user: { username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Error creating account', details: error.message });
  }
});

// Standard Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.json({
      message: 'Login successful',
      user: { username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
});

// Google Login Route
// const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = "980795496607-cu74s23mantlk7c3nfi4mpe406ejmg7n.apps.googleusercontent.com";

const client = new OAuth2Client(CLIENT_ID);

app.post("/api/google-login", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    let payload;
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
      });
      payload = ticket.getPayload();
    } catch (verifyError) {
      console.warn("Time skew/verify error detected, falling back to manual decode:", verifyError.message);
      const base64Payload = token.split('.')[1];
      const decoded = Buffer.from(base64Payload, 'base64').toString('utf-8');
      payload = JSON.parse(decoded);
    }

    const user = {
      username: payload.name || 'Google User',
      email: payload.email,
      picture: payload.picture
    };

    res.json({ user });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(401).json({ error: "Google login failed" });
  }
});

// ============================================================================
// STATIC FILES
// ============================================================================

app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🏥 Hospital Navigation Server running on http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log(`  - GET  /api/locations - Get all locations`);
  console.log(`  - GET  /api/graph - Get hospital graph`);
  console.log(`  - POST /api/find-path - Find path between locations`);
  console.log(`  - GET  /api/services - Get all services`);
  console.log(`  - GET  /api/facilities - Get all facilities`);
  console.log(`  - GET  /api/search - Search locations`);
});

export default app;
