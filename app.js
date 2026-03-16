/**
 * Hospital Indoor Navigation App
 * 
 * A web-based indoor navigation system for hospitals using graph-based pathfinding,
 * landmark tracking, and swipe gestures. No external map APIs required.
 * 
 * @author Your Name
 * @version 2.0
 */

// ============================================================================
// DATA STRUCTURES & CONFIGURATION
// ============================================================================

/**
 * Graph-based representation of hospital floor plan
 * Each node represents a location (room, corridor junction, etc.)
 * Edges represent walkable paths between nodes
 */
const HOSPITAL_GRAPH = {
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
const LANDMARK_DATA = {
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

// ============================================================================
// PATHFINDING ALGORITHM (Dijkstra's Algorithm)
// ============================================================================

/**
 * Pathfinding class implementing Dijkstra's algorithm
 * Finds shortest path between two nodes in the graph
 */
class Pathfinder {
    constructor(graph) {
        this.graph = graph;
        this.nodes = graph.nodes;
        this.edges = graph.edges;
    }

    /**
     * Find shortest path using Dijkstra's algorithm
     * @param {string} startId - Starting node ID
     * @param {string} endId - Destination node ID
     * @returns {Array} Array of node objects representing the path
     */
    findShortestPath(startId, endId) {
        // Initialize distance map: distance from start to each node
        const distances = {};
        // Initialize previous map: tracks path reconstruction
        const previous = {};
        // Priority queue: nodes to visit (using array, could use heap for better performance)
        const unvisited = new Set();
        
        // Initialize distances: Infinity for all nodes except start (0)
        this.nodes.forEach(node => {
            distances[node.id] = node.id === startId ? 0 : Infinity;
            previous[node.id] = null;
            unvisited.add(node.id);
        });

        // Main Dijkstra loop
        while (unvisited.size > 0) {
            // Find unvisited node with smallest distance
            let currentNodeId = null;
            let smallestDistance = Infinity;
            
            unvisited.forEach(nodeId => {
                if (distances[nodeId] < smallestDistance) {
                    smallestDistance = distances[nodeId];
                    currentNodeId = nodeId;
                }
            });

            // If no path exists, break
            if (currentNodeId === null || distances[currentNodeId] === Infinity) {
                break;
            }

            // Remove current node from unvisited set
            unvisited.delete(currentNodeId);

            // If we reached the destination, reconstruct and return path
            if (currentNodeId === endId) {
                return this.reconstructPath(previous, startId, endId);
            }

            // Check all neighbors of current node
            const neighbors = this.getNeighbors(currentNodeId);
            neighbors.forEach(neighbor => {
                const edge = this.getEdge(currentNodeId, neighbor);
                if (edge) {
                    const altDistance = distances[currentNodeId] + edge.weight;
                    
                    // If found shorter path, update distance and previous
                    if (altDistance < distances[neighbor]) {
                        distances[neighbor] = altDistance;
                        previous[neighbor] = currentNodeId;
                    }
                }
            });
        }

        // No path found
        return [];
    }

    /**
     * Get all neighbor node IDs connected to given node
     * @param {string} nodeId - Node ID
     * @returns {Array} Array of neighbor node IDs
     */
    getNeighbors(nodeId) {
        return this.edges
            .filter(edge => edge.from === nodeId)
            .map(edge => edge.to);
    }

    /**
     * Get edge between two nodes
     * @param {string} fromId - Source node ID
     * @param {string} toId - Target node ID
     * @returns {Object|null} Edge object or null if not found
     */
    getEdge(fromId, toId) {
        return this.edges.find(edge => edge.from === fromId && edge.to === toId) || null;
    }

    /**
     * Reconstruct path from previous map
     * @param {Object} previous - Map of node -> previous node
     * @param {string} startId - Starting node ID
     * @param {string} endId - Ending node ID
     * @returns {Array} Array of node objects in path order
     */
    reconstructPath(previous, startId, endId) {
        const path = [];
        let currentNodeId = endId;

        // Traverse backwards from end to start
        while (currentNodeId !== null) {
            const node = this.nodes.find(n => n.id === currentNodeId);
            if (node) {
                path.unshift(node); // Add to beginning of array
            }
            currentNodeId = previous[currentNodeId];
        }

        return path;
    }

    /**
     * Get node by ID
     * @param {string} nodeId - Node ID
     * @returns {Object|null} Node object or null
     */
    getNode(nodeId) {
        return this.nodes.find(node => node.id === nodeId) || null;
    }
}

// ============================================================================
// NAVIGATION POINTER ANIMATION
// ============================================================================

/**
 * NavigationPointer class handles the animated pointer that moves along the path
 */
class NavigationPointer {
    constructor(svgElement) {
        this.svg = svgElement;
        this.pointerGroup = null;
        this.currentPosition = { x: 0, y: 0 };
        this.animationId = null;
        this.isAnimating = false;
    }

    /**
     * Create SVG pointer element (arrow)
     */
    createPointer() {
        // Remove existing pointer if any
        const existing = document.getElementById('navPointer');
        if (existing) existing.remove();

        // Create group for pointer
        this.pointerGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.pointerGroup.setAttribute('id', 'navPointer');
        this.pointerGroup.style.opacity = '0';

        // Create arrow shape
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arrow.setAttribute('d', 'M 0,-10 L -8,8 L 0,4 L 8,8 Z');
        arrow.setAttribute('fill', '#34A853');
        arrow.setAttribute('stroke', '#fff');
        arrow.setAttribute('stroke-width', '2');

        // Create pulsing circle behind arrow
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '12');
        circle.setAttribute('fill', '#34A853');
        circle.setAttribute('opacity', '0.2');
        circle.setAttribute('class', 'pulse-dot');

        this.pointerGroup.appendChild(circle);
        this.pointerGroup.appendChild(arrow);
        this.svg.appendChild(this.pointerGroup);
    }

    /**
     * Set pointer position without animation
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} angle - Rotation angle in degrees (optional)
     */
    setPosition(x, y, angle = 0) {
        if (!this.pointerGroup) return;
        
        this.pointerGroup.style.opacity = '1';
        this.pointerGroup.setAttribute('transform', `translate(${x}, ${y}) rotate(${angle})`);
        this.currentPosition = { x, y };
    }

    /**
     * Animate pointer from current position to target position
     * @param {Object} target - Target position {x, y}
     * @param {number} duration - Animation duration in milliseconds (default: 2000)
     */
    animateToPosition(target, duration = 2000) {
        if (!this.pointerGroup) {
            console.warn('Pointer group not initialized');
            return;
        }

        // Stop any existing animation
        this.stopAnimation();

        // Ensure pointer is visible
        this.pointerGroup.style.opacity = '1';
        this.isAnimating = true;

        // Get current position - use actual currentPosition or get from transform attribute
        let startX, startY;
        if (this.currentPosition && this.currentPosition.x !== undefined && this.currentPosition.y !== undefined) {
            startX = this.currentPosition.x;
            startY = this.currentPosition.y;
        } else {
            // Try to get position from transform attribute
            const transform = this.pointerGroup.getAttribute('transform');
            if (transform) {
                const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                if (match) {
                    startX = parseFloat(match[1]) || 0;
                    startY = parseFloat(match[2]) || 0;
                } else {
                    startX = 0;
                    startY = 0;
                }
            } else {
                startX = 0;
                startY = 0;
            }
            // Update currentPosition
            this.currentPosition = { x: startX, y: startY };
        }

        const startTime = Date.now();

        // Calculate distance for duration adjustment
        const dx = target.x - startX;
        const dy = target.y - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Use provided duration or calculate based on distance
        const adjustedDuration = duration || Math.max(1000, Math.min(3000, (distance / 100) * 1000));

        // Debug log (can be removed later)
        console.log(`Animating pointer from (${startX}, ${startY}) to (${target.x}, ${target.y}) over ${adjustedDuration}ms`);
        
        // Ensure pointer group exists and is visible
        if (!this.pointerGroup || !this.pointerGroup.parentNode) {
            console.error('Pointer group not found, recreating...');
            this.createPointer();
        }

        const animate = () => {
            if (!this.isAnimating) return;

            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / adjustedDuration, 1);

            // Easing function for smooth animation
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : -1 + (4 - 2 * progress) * progress;

            const x = startX + (target.x - startX) * easeProgress;
            const y = startY + (target.y - startY) * easeProgress;

            // Calculate rotation angle towards target
            const angle = Math.atan2(target.y - startY, target.x - startX) * 180 / Math.PI;

            // Update pointer position and rotation
            this.pointerGroup.setAttribute('transform', `translate(${x}, ${y}) rotate(${angle})`);
            this.currentPosition = { x, y };

            // Continue animation if not complete
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                // Ensure final position is set
                this.currentPosition = { x: target.x, y: target.y };
            }
        };

        // Start animation
        animate();
    }

    /**
     * Animate pointer along path (kept for backward compatibility, but not used in new flow)
     * @param {Array} pathNodes - Array of node objects representing the path
     * @param {number} duration - Animation duration in milliseconds
     */
    animateAlongPath(pathNodes, duration = 10000) {
        if (pathNodes.length < 2) return;

        // Stop any existing animation
        this.stopAnimation();

        // Show pointer
        this.pointerGroup.style.opacity = '1';
        this.isAnimating = true;

        // Calculate total path length
        let totalLength = 0;
        const segments = [];
        for (let i = 0; i < pathNodes.length - 1; i++) {
            const start = pathNodes[i];
            const end = pathNodes[i + 1];
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            segments.push({ start, end, length });
            totalLength += length;
        }

        // Animation parameters
        const startTime = Date.now();
        let progress = 0;

        const animate = () => {
            if (!this.isAnimating) return;

            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);

            // Calculate current position along path
            let currentDistance = progress * totalLength;
            let segmentIndex = 0;
            let accumulatedLength = 0;

            // Find which segment we're on
            for (let i = 0; i < segments.length; i++) {
                if (currentDistance <= accumulatedLength + segments[i].length) {
                    segmentIndex = i;
                    break;
                }
                accumulatedLength += segments[i].length;
            }

            // Calculate position within current segment
            const segment = segments[segmentIndex];
            const segmentProgress = (currentDistance - accumulatedLength) / segment.length;
            const x = segment.start.x + (segment.end.x - segment.start.x) * segmentProgress;
            const y = segment.start.y + (segment.end.y - segment.start.y) * segmentProgress;

            // Calculate rotation angle
            const angle = Math.atan2(segment.end.y - segment.start.y, segment.end.x - segment.start.x) * 180 / Math.PI;

            // Update pointer position and rotation
            this.pointerGroup.setAttribute('transform', `translate(${x}, ${y}) rotate(${angle})`);
            this.currentPosition = { x, y };

            // Continue animation if not complete
            if (progress < 1) {
                this.animationId = requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
            }
        };

        // Start animation
        animate();
    }

    /**
     * Stop pointer animation
     */
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Hide pointer
     */
    hide() {
        if (this.pointerGroup) {
            this.pointerGroup.style.opacity = '0';
        }
        this.stopAnimation();
    }
}

// ============================================================================
// MAIN NAVIGATION APP CLASS
// ============================================================================

/**
 * HospitalNavigation - Main application class
 * Manages navigation state, UI interactions, and coordinates all components
 */
class HospitalNavigation {
    constructor() {
        // Initialize pathfinder with hospital graph
        this.pathfinder = new Pathfinder(HOSPITAL_GRAPH);
        
        // Current location (default: Registration Counter)
        this.currentLocation = this.pathfinder.getNode('reg-counter');
        
        // Navigation state
        this.selectedDestination = null;
        this.navigationActive = false;
        this.currentPath = [];
        this.landmarks = [];
        this.currentLandmarkIndex = 0;
        
        // Initialize navigation pointer
        const svg = document.getElementById('mapSvg');
        this.navPointer = new NavigationPointer(svg);
        
        // Initialize app
        this.init();
    }

    /**
     * Initialize application
     */
    init() {
        this.setupEventListeners();
        this.drawHospitalMap();
        this.setupSwipeGesture();
        this.navPointer.createPointer();
        
        // Set default destination to AB Ward
        document.getElementById('destinationSelect').value = 'ab-ward';
        this.selectedDestination = 'ab-ward';
        document.getElementById('startBtn').disabled = false;
    }

    /**
     * Setup event listeners for UI interactions
     */
    setupEventListeners() {
        // Start navigation button
        document.getElementById('startBtn').addEventListener('click', () => this.startNavigation());

        // Back button to cancel navigation and go back to destination selection
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.cancelNavigation());
        }
        
        // Destination selection dropdown
        document.getElementById('destinationSelect').addEventListener('change', (e) => {
            this.selectedDestination = e.target.value;
            document.getElementById('startBtn').disabled = !this.selectedDestination;
            
            // Update path visualization when destination changes
            if (this.selectedDestination) {
                this.updatePathVisualization();
            }
        });
        
        // Skip landmark button
        document.getElementById('skipBtn').addEventListener('click', () => this.skipLandmark());
        
        // Close destination reached modal
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeReachedModal());
    }

    /**
     * Draw hospital map with rooms and corridors
     */
    drawHospitalMap() {
        const roomsGroup = document.getElementById('rooms');
        
        // Draw all nodes from graph
        HOSPITAL_GRAPH.nodes.forEach(node => {
            // Skip junction nodes (they're invisible)
            if (node.type === 'junction') return;
            
            // Draw room/landmark rectangles
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', node.x - 15);
            rect.setAttribute('y', node.y - 10);
            rect.setAttribute('width', '30');
            rect.setAttribute('height', '20');
            rect.setAttribute('fill', this.getNodeColor(node.type));
            rect.setAttribute('stroke', '#9CA3AF');
            rect.setAttribute('stroke-width', '1');
            rect.setAttribute('rx', '2');
            rect.setAttribute('data-node-id', node.id);
            roomsGroup.appendChild(rect);

            // Draw room label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', node.x);
            text.setAttribute('y', node.y + 5);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('font-size', '10');
            text.setAttribute('fill', '#6B7280');
            text.textContent = node.name.split(' - ')[0]; // Show short name
            roomsGroup.appendChild(text);
        });
    }

    /**
     * Get color for node based on type
     * @param {string} type - Node type
     * @returns {string} Color hex code
     */
    getNodeColor(type) {
        const colors = {
            'entrance': '#E5E7EB',
            'landmark': '#DBEAFE',
            'destination': '#FEE2E2',
            'junction': '#F3F4F6'
        };
        return colors[type] || '#E5E7EB';
    }

    /**
     * Update path visualization when destination changes (before starting navigation)
     */
    updatePathVisualization() {
        if (!this.selectedDestination) return;
        
        const destinationNode = this.pathfinder.getNode(this.selectedDestination);
        if (!destinationNode) return;

        // Calculate path
        const path = this.pathfinder.findShortestPath(
            this.currentLocation.id,
            destinationNode.id
        );

        if (path.length > 0) {
            // Draw preview path
            const pathData = this.createPathData(path);
            const pathElement = document.getElementById('navigationPath');
            pathElement.setAttribute('d', pathData);
            pathElement.style.opacity = '0.5'; // Dimmed preview
            
            // Update destination marker
            const destMarker = document.getElementById('destMarker');
            const destMarkerOuter = document.getElementById('destMarkerOuter');
            destMarker.setAttribute('cx', destinationNode.x);
            destMarker.setAttribute('cy', destinationNode.y);
            destMarkerOuter.setAttribute('cx', destinationNode.x);
            destMarkerOuter.setAttribute('cy', destinationNode.y);
        }
    }

    /**
     * Create SVG path data string from array of nodes
     * @param {Array} pathNodes - Array of node objects
     * @returns {string} SVG path data string
     */
    createPathData(pathNodes) {
        if (pathNodes.length === 0) return '';
        
        let pathData = `M ${pathNodes[0].x} ${pathNodes[0].y}`;
        
        // Create smooth path using quadratic curves
        for (let i = 1; i < pathNodes.length; i++) {
            const prev = pathNodes[i - 1];
            const curr = pathNodes[i];
            const midX = (prev.x + curr.x) / 2;
            const midY = (prev.y + curr.y) / 2;
            
            if (i === 1) {
                pathData += ` L ${midX} ${midY}`;
            } else {
                pathData += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
            }
            pathData += ` L ${curr.x} ${curr.y}`;
        }
        
        return pathData;
    }

    /**
     * Extract landmarks from path (nodes with type 'landmark')
     * @param {Array} pathNodes - Array of node objects
     * @returns {Array} Array of landmark objects with metadata
     */
    extractLandmarks(pathNodes) {
        return pathNodes
            .filter(node => node.type === 'landmark' && LANDMARK_DATA[node.id])
            .map(node => ({
                ...node,
                ...LANDMARK_DATA[node.id]
            }));
    }

    /**
     * Start navigation mode
     */
    startNavigation() {
        if (!this.selectedDestination) return;

        const destinationNode = this.pathfinder.getNode(this.selectedDestination);
        if (!destinationNode) return;

        // Calculate shortest path using Dijkstra
        const path = this.pathfinder.findShortestPath(
            this.currentLocation.id,
            destinationNode.id
        );

        if (path.length === 0) {
            alert('No path found to destination!');
            return;
        }

        // Update state
        this.navigationActive = true;
        this.currentPath = path;
        this.currentLandmarkIndex = 0;
        this.landmarks = this.extractLandmarks(path);

        // Draw path
        const pathData = this.createPathData(path);
        const pathElement = document.getElementById('navigationPath');
        pathElement.setAttribute('d', pathData);
        pathElement.style.opacity = '1';

        // Update destination marker
        const destMarker = document.getElementById('destMarker');
        const destMarkerOuter = document.getElementById('destMarkerOuter');
        destMarker.setAttribute('cx', destinationNode.x);
        destMarker.setAttribute('cy', destinationNode.y);
        destMarkerOuter.setAttribute('cx', destinationNode.x);
        destMarkerOuter.setAttribute('cy', destinationNode.y);

        // Draw landmark markers
        this.drawLandmarkMarkers();

        // Show navigation info
        document.getElementById('navInfo').classList.remove('hidden');
        this.updateNavigationInfo(path);

        // Hide destination panel
        document.getElementById('destinationPanel').classList.add('hidden');

        // Position pointer at starting location (don't animate yet)
        // Make sure pointer is created first
        if (!this.navPointer.pointerGroup) {
            this.navPointer.createPointer();
        }
        this.navPointer.setPosition(
            this.currentLocation.x,
            this.currentLocation.y,
            0
        );
        // Ensure currentPosition is set
        this.navPointer.currentPosition = { x: this.currentLocation.x, y: this.currentLocation.y };

        // Show back button while navigation is active
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.classList.remove('hidden');
        }

        // Show first landmark if available
        if (this.landmarks.length > 0) {
            setTimeout(() => {
                this.showLandmark(0);
            }, 500);
        } else {
            // If no landmarks, show destination reached immediately
            setTimeout(() => {
                // Animate pointer to destination
                this.navPointer.animateToPosition(
                    { x: destinationNode.x, y: destinationNode.y },
                    2000
                );
                setTimeout(() => {
                    this.showDestinationReached();
                }, 2500);
            }, 500);
        }
    }

    /**
     * Calculate animation duration based on path length
     * @param {Array} pathNodes - Array of node objects
     * @returns {number} Duration in milliseconds
     */
    calculateAnimationDuration(pathNodes) {
        let totalLength = 0;
        for (let i = 0; i < pathNodes.length - 1; i++) {
            const dx = pathNodes[i + 1].x - pathNodes[i].x;
            const dy = pathNodes[i + 1].y - pathNodes[i].y;
            totalLength += Math.sqrt(dx * dx + dy * dy);
        }
        // 100ms per 10 units of distance (adjustable)
        return Math.max(5000, Math.min(20000, totalLength * 10));
    }

    /**
     * Draw landmark markers on map
     */
    drawLandmarkMarkers() {
        const markersGroup = document.getElementById('landmarkMarkers');
        markersGroup.innerHTML = '';

        this.landmarks.forEach((landmark, index) => {
            // Marker circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', landmark.x);
            circle.setAttribute('cy', landmark.y);
            circle.setAttribute('r', '6');
            circle.setAttribute('fill', landmark.color || '#FBBC04');
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            circle.setAttribute('class', 'landmark-marker');
            circle.setAttribute('data-index', index);
            markersGroup.appendChild(circle);

            // Pulsing outer circle
            const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            outerCircle.setAttribute('cx', landmark.x);
            outerCircle.setAttribute('cy', landmark.y);
            outerCircle.setAttribute('r', '10');
            outerCircle.setAttribute('fill', landmark.color || '#FBBC04');
            outerCircle.setAttribute('opacity', '0.3');
            outerCircle.setAttribute('class', 'pulse-dot');
            markersGroup.appendChild(outerCircle);
        });
    }

    /**
     * Update navigation info (distance, ETA)
     * @param {Array} pathNodes - Array of node objects
     */
    updateNavigationInfo(pathNodes) {
        // Calculate total distance
        let totalDistance = 0;
        for (let i = 1; i < pathNodes.length; i++) {
            const dx = pathNodes[i].x - pathNodes[i - 1].x;
            const dy = pathNodes[i].y - pathNodes[i - 1].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }
        
        // Convert to meters (assuming 1 unit = 0.5 meters)
        const distanceInMeters = Math.round(totalDistance * 0.5);
        // Calculate ETA (assuming 50m/min walking speed)
        const etaMinutes = Math.ceil(distanceInMeters / 50);

        document.getElementById('distance').textContent = distanceInMeters;
        document.getElementById('eta').textContent = etaMinutes;
    }

    /**
     * Show landmark card at bottom of screen
     * @param {number} index - Index of landmark in landmarks array
     */
    showLandmark(index) {
        if (index >= this.landmarks.length) {
            this.showDestinationReached();
            return;
        }

        const landmark = this.landmarks[index];
        this.currentLandmarkIndex = index;

        // Update landmark card content
        document.getElementById('landmarkName').textContent = landmark.name;
        document.getElementById('landmarkDescription').textContent = landmark.description;
        
        // Update icon if available
        const iconElement = document.querySelector('#landmarkCard .fa-map-marker-alt');
        if (iconElement && landmark.icon) {
            iconElement.className = `fas ${landmark.icon} text-blue-600 text-2xl`;
        }

        // Show landmark card with animation
        const card = document.getElementById('landmarkCard');
        card.classList.remove('hidden');
        setTimeout(() => {
            card.classList.remove('translate-y-full');
        }, 10);

        // Highlight current landmark marker
        const markers = document.querySelectorAll('.landmark-marker');
        markers.forEach((marker, i) => {
            if (i === index) {
                marker.setAttribute('r', '8');
                marker.setAttribute('fill', '#34A853');
            } else {
                marker.setAttribute('r', '6');
                marker.setAttribute('fill', landmark.color || '#FBBC04');
            }
        });
    }

    /**
     * Setup swipe gesture handlers (touch and mouse)
     */
    setupSwipeGesture() {
        const swipeArea = document.getElementById('swipeArea');
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        // Add click handler as alternative to swipe (for easier desktop use)
        let clickAllowed = true;
        
        swipeArea.addEventListener('mousedown', () => {
            clickAllowed = true;
        });
        
        swipeArea.addEventListener('mousemove', () => {
            // If mouse moved, it's a drag, not a click
            if (isDragging) {
                clickAllowed = false;
            }
        });
        
        // Simple click handler (works for both touch and mouse)
        swipeArea.addEventListener('click', (e) => {
            if (clickAllowed && !isDragging) {
                e.preventDefault();
                e.stopPropagation();
                this.confirmLandmark();
            }
        });

        // Touch events for mobile
        swipeArea.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            swipeArea.style.transition = 'none';
            e.preventDefault();
        });

        swipeArea.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            
            if (diff > 0) {
                swipeArea.style.transform = `translateX(${Math.min(diff, 150)}px)`;
                swipeArea.style.opacity = `${Math.max(0.3, 1 - diff / 200)}`;
            }
        });

        swipeArea.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = currentX - startX;
            if (diff > 100) {
                // Swipe successful
                this.confirmLandmark();
            } else {
                // Reset position
                this.resetSwipeArea(swipeArea);
            }
            // Reset dragging flag
            isDragging = false;
        });

        // Mouse events for desktop
        swipeArea.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            isDragging = true;
            swipeArea.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            currentX = e.clientX;
            const diff = currentX - startX;
            
            if (diff > 0) {
                swipeArea.style.transform = `translateX(${Math.min(diff, 150)}px)`;
                swipeArea.style.opacity = `${Math.max(0.3, 1 - diff / 200)}`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = currentX - startX;
            if (diff > 100) {
                this.confirmLandmark();
            } else {
                this.resetSwipeArea(swipeArea);
            }
            // Reset dragging flag
            isDragging = false;
        });
    }

    /**
     * Reset swipe area to original position
     * @param {HTMLElement} swipeArea - Swipe area element
     */
    resetSwipeArea(swipeArea) {
        swipeArea.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        swipeArea.style.transform = 'translateX(0)';
        swipeArea.style.opacity = '1';
    }

    /**
     * Confirm landmark reached (called after successful swipe)
     */
    confirmLandmark() {
        const swipeArea = document.getElementById('swipeArea');
        swipeArea.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        swipeArea.style.transform = 'translateX(100%)';
        swipeArea.style.opacity = '0';

        // Get current landmark position for pointer animation
        const currentLandmark = this.landmarks[this.currentLandmarkIndex];
        
        // Hide landmark card
        setTimeout(() => {
            const card = document.getElementById('landmarkCard');
            card.classList.add('translate-y-full');
            
            setTimeout(() => {
                card.classList.add('hidden');
                this.resetSwipeArea(swipeArea);
            }, 300);

            // Move pointer to current landmark position first (to show confirmation)
            if (currentLandmark) {
                console.log('Moving pointer to current landmark:', currentLandmark);
                this.navPointer.animateToPosition(
                    { x: currentLandmark.x, y: currentLandmark.y },
                    1000
                );
            }

            // Show next landmark or destination
            this.currentLandmarkIndex++;
            if (this.currentLandmarkIndex < this.landmarks.length) {
                // Animate pointer to next landmark after reaching current one
                setTimeout(() => {
                    const nextLandmark = this.landmarks[this.currentLandmarkIndex];
                    if (nextLandmark) {
                        console.log('Moving pointer to next landmark:', nextLandmark);
                        this.navPointer.animateToPosition(
                            { x: nextLandmark.x, y: nextLandmark.y },
                            2000
                        );
                    }
                    // Show next landmark card after pointer starts moving
                    setTimeout(() => {
                        this.showLandmark(this.currentLandmarkIndex);
                    }, 500);
                }, 1200);
            } else {
                // Animate pointer to destination
                setTimeout(() => {
                    const destinationNode = this.pathfinder.getNode(this.selectedDestination);
                    if (destinationNode) {
                        console.log('Moving pointer to destination:', destinationNode);
                        this.navPointer.animateToPosition(
                            { x: destinationNode.x, y: destinationNode.y },
                            2000
                        );
                    }
                    setTimeout(() => {
                        this.showDestinationReached();
                    }, 2500);
                }, 1200);
            }
        }, 300);
    }

    /**
     * Skip current landmark
     */
    skipLandmark() {
        // Get current landmark position for pointer animation
        const currentLandmark = this.landmarks[this.currentLandmarkIndex];
        
        this.currentLandmarkIndex++;
        const card = document.getElementById('landmarkCard');
        card.classList.add('translate-y-full');
        
        setTimeout(() => {
            card.classList.add('hidden');
            
            // Move pointer to current landmark position first (to show confirmation)
            if (currentLandmark) {
                this.navPointer.animateToPosition(
                    { x: currentLandmark.x, y: currentLandmark.y },
                    1000
                );
            }
            
            if (this.currentLandmarkIndex < this.landmarks.length) {
                // Animate pointer to next landmark after reaching current one
                setTimeout(() => {
                    const nextLandmark = this.landmarks[this.currentLandmarkIndex];
                    if (nextLandmark) {
                        this.navPointer.animateToPosition(
                            { x: nextLandmark.x, y: nextLandmark.y },
                            2000
                        );
                    }
                    // Show next landmark card after pointer starts moving
                    setTimeout(() => {
                        this.showLandmark(this.currentLandmarkIndex);
                    }, 500);
                }, 1200);
            } else {
                // Animate pointer to destination
                setTimeout(() => {
                    const destinationNode = this.pathfinder.getNode(this.selectedDestination);
                    if (destinationNode) {
                        this.navPointer.animateToPosition(
                            { x: destinationNode.x, y: destinationNode.y },
                            2000
                        );
                    }
                    setTimeout(() => {
                        this.showDestinationReached();
                    }, 2500);
                }, 1200);
            }
        }, 300);
    }

    /**
     * Show destination reached modal
     */
    showDestinationReached() {
        // Stop pointer animation
        this.navPointer.stopAnimation();
        
        // Hide navigation info
        document.getElementById('navInfo').classList.add('hidden');
        
        // Hide landmark card if visible
        const card = document.getElementById('landmarkCard');
        card.classList.add('translate-y-full');
        setTimeout(() => {
            card.classList.add('hidden');
        }, 300);

        // Show reached modal
        setTimeout(() => {
            document.getElementById('reachedModal').classList.remove('hidden');
        }, 500);

        // Update current location
        if (this.selectedDestination) {
            const destinationNode = this.pathfinder.getNode(this.selectedDestination);
            if (destinationNode) {
                this.currentLocation = destinationNode;
                document.getElementById('currentLocation').textContent = destinationNode.name;
                
                // Update current marker position
                const currentMarker = document.getElementById('currentMarker');
                const currentMarkerOuter = document.getElementById('currentMarkerOuter');
                currentMarker.setAttribute('cx', destinationNode.x);
                currentMarker.setAttribute('cy', destinationNode.y);
                currentMarkerOuter.setAttribute('cx', destinationNode.x);
                currentMarkerOuter.setAttribute('cy', destinationNode.y);
            }
        }

        this.navigationActive = false;

        // Hide back button when navigation is finished
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.classList.add('hidden');
        }
    }

    /**
     * Close destination reached modal and reset navigation
     */
    closeReachedModal() {
        document.getElementById('reachedModal').classList.add('hidden');
        
        // Hide navigation pointer
        this.navPointer.hide();
        
        // Reset navigation
        document.getElementById('destinationPanel').classList.remove('hidden');
        document.getElementById('destinationSelect').value = '';
        document.getElementById('startBtn').disabled = true;
        this.selectedDestination = null;
        
        // Clear path
        const pathElement = document.getElementById('navigationPath');
        pathElement.style.opacity = '0';
        
        // Clear landmark markers
        document.getElementById('landmarkMarkers').innerHTML = '';
    }

    /**
     * Cancel current navigation and go back to destination selection
     */
    cancelNavigation() {
        if (!this.navigationActive) {
            return;
        }

        // Stop pointer and hide it
        this.navPointer.hide();

        // Hide navigation info
        document.getElementById('navInfo').classList.add('hidden');

        // Hide landmark card if visible
        const card = document.getElementById('landmarkCard');
        card.classList.add('translate-y-full');
        setTimeout(() => {
            card.classList.add('hidden');
        }, 200);

        // Show destination selection panel again
        document.getElementById('destinationPanel').classList.remove('hidden');

        // Keep current destination selected so user can restart quickly
        // Just clear the drawn path and markers
        const pathElement = document.getElementById('navigationPath');
        pathElement.style.opacity = '0';
        document.getElementById('landmarkMarkers').innerHTML = '';

        // Reset internal navigation state
        this.navigationActive = false;
        this.currentPath = [];
        this.landmarks = [];
        this.currentLandmarkIndex = 0;

        // Hide back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.classList.add('hidden');
        }
    }
}

// ============================================================================
// INITIALIZE APP
// ============================================================================

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HospitalNavigation();
});
