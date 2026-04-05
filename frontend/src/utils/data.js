/**
 * Graph-based representation of hospital floor plan
 * Each node represents a location (room, corridor junction, etc.)
 * Edges represent walkable paths between nodes
 */
export const HOSPITAL_GRAPH = {
  // Node definitions: { id, x, y, name, type }
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
      // Junction nodes for pathfinding
      { id: 'junction-1', x: 150, y: 350, name: 'Corridor Junction', type: 'junction' },
      { id: 'junction-2', x: 300, y: 300, name: 'Corridor Junction', type: 'junction' },
      { id: 'junction-3', x: 450, y: 350, name: 'Corridor Junction', type: 'junction' }
  ],
  
  // Edge definitions: { from, to, weight (distance) }
  edges: [
      // Main path: Registration Counter -> AB Ward
      { from: 'reg-counter', to: 'room-22', weight: 100 },
      { from: 'room-22', to: 'room-20', weight: 100 },
      { from: 'room-20', to: 'room-25', weight: 100 },
      { from: 'room-25', to: 'room-27', weight: 100 },
      { from: 'room-27', to: 'room-30', weight: 100 },
      { from: 'room-30', to: 'ab-ward', weight: 100 },
      
      // Paths to Emergency
      { from: 'reg-counter', to: 'junction-1', weight: 80 },
      { from: 'junction-1', to: 'emergency', weight: 150 },
      
      // Paths to X-Ray
      { from: 'room-27', to: 'junction-3', weight: 130 },
      { from: 'junction-3', to: 'xray', weight: 50 },
      
      // Paths to Lab
      { from: 'room-27', to: 'lab', weight: 130 },
      
      // Paths to Pharmacy
      { from: 'room-20', to: 'pharmacy', weight: 110 },
      
      // Paths to Canteen
      { from: 'room-25', to: 'canteen', weight: 20 },
      
      // Bidirectional connections (add reverse edges)
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

/**
* Landmark data structure
* Landmarks are special nodes that users must confirm reaching
*/
export const LANDMARK_DATA = {
  'room-22': {
      name: 'Room 22 - पूछताछ',
      description: 'Inquiry Counter (पूछताछ)',
      icon: 'fa-question-circle',
      color: '#3B82F6'
  },
  'room-20': {
      name: 'Room 20 - कैश काउन्टर',
      description: 'Cash Counter (कैश काउन्टर)',
      icon: 'fa-money-bill-wave',
      color: '#10B981'
  },
  'room-25': {
      name: 'Room 25 - नर्सिग ऑफिस',
      description: 'Nursing Office (नर्सिग ऑफिस)',
      icon: 'fa-user-nurse',
      color: '#8B5CF6'
  },
  'room-27': {
      name: 'Room 27 - ECG',
      description: 'ECG Room',
      icon: 'fa-heartbeat',
      color: '#EF4444'
  },
  'room-30': {
      name: 'Room 30 - 1C वार्ड',
      description: '1C Ward (1C वार्ड)',
      icon: 'fa-bed',
      color: '#F59E0B'
  }
};
