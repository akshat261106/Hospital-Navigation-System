/**
 * Pathfinding class implementing Dijkstra's algorithm
 * Finds shortest path between two nodes in the graph
 */
export class Pathfinder {
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

          if (currentNodeId === null || distances[currentNodeId] === Infinity) {
              break;
          }

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
}
