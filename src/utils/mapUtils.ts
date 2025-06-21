import mapboxgl from 'mapbox-gl';
import Supercluster from 'supercluster';
import type { Property } from '../types/Property';
import Currency from './currency';

export function formatPrice(price: number, type: 'rent' | 'buy'): string {
  if (type === 'rent') {
    return `$${price.toLocaleString()}/mo`;
  }
  return `$${price.toLocaleString()}`;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString()} sq ft`;
}

export function formatPropertyType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function createPropertyMarker(property: Property): mapboxgl.Marker {
  const el = document.createElement('div');
  el.className = 'price-marker';
  
  const { price, currency } = Currency(property.currency, property.price);
  el.textContent = property.type === 'rent' 
    ? `${currency}${price}/mo`
    : `${currency}${price}`;
  
  return new mapboxgl.Marker({ 
    element: el,
    anchor: 'bottom'
  }).setLngLat(property.coordinates);
}

export function fitMapToBounds(map: mapboxgl.Map, properties: Property[]): void {
  if (properties.length === 0) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  properties.forEach(property => {
    bounds.extend(property.coordinates);
  });
  
  map.fitBounds(bounds, {
    padding: { top: 50, bottom: 50, left: 50, right: 50 },
    maxZoom: 15
  });
}

// Enhanced clustering configuration (same as React app)
const CLUSTER_CONFIG = {
  radius: 35, // Slightly smaller radius for better separation
  maxZoom: 22, // Higher max zoom for edge cases  
  minPoints: 2,
};

// Create SuperCluster instance
let clusterIndex: Supercluster | null = null;

// Initialize SuperCluster
function initializeCluster() {
  if (!clusterIndex) {
    clusterIndex = new Supercluster(CLUSTER_CONFIG);
  }
  return clusterIndex;
}

// SuperCluster-based clustering function
export function clusterProperties(properties: Property[], zoom: number): Array<{
  properties: Property[];
  center: [number, number];
  isCluster: boolean;
  clusterId?: number;
}> {
  if (properties.length === 0) return [];
  
  const cluster = initializeCluster();
  
  // Convert properties to GeoJSON points for SuperCluster - check for invalid coordinates
  const validProperties = properties.filter((property) => {
    const [lng, lat] = property.coordinates;
    const isValid = typeof lng === 'number' && typeof lat === 'number' && 
                   !isNaN(lng) && !isNaN(lat) && 
                   lng >= -180 && lng <= 180 && 
                   lat >= -90 && lat <= 90;
    
    if (!isValid) {
      console.warn(`⚠️ Invalid coordinates for property ${property.id}:`, property.coordinates);
    }
    
    return isValid;
  });
  
  const points: Supercluster.PointFeature<Property>[] = validProperties.map((property) => ({
    type: 'Feature',
    properties: property,
    geometry: {
      type: 'Point',
      coordinates: property.coordinates,
    },
  }));
  
  // Load points into SuperCluster
  cluster.load(points);
  
  // Get clusters at current zoom level
  const bounds = [-180, -85, 180, 85]; // World bounds
  const clusters = cluster.getClusters(bounds, Math.floor(zoom));
  
  // Convert SuperCluster results back to our format
  const result = clusters.map((clusterFeature) => {
    if (clusterFeature.properties?.cluster) {
      // This is a cluster
      const clusterId = clusterFeature.properties.cluster_id;
      const pointCount = clusterFeature.properties.point_count;
      
      // Get the individual properties in this cluster
      const clusterPoints = cluster.getLeaves(clusterId, Infinity);
      const clusterProperties = clusterPoints.map(point => point.properties);
      
      return {
        properties: clusterProperties,
        center: clusterFeature.geometry.coordinates as [number, number],
        isCluster: true,
        clusterId,
      };
    } else {
      // This is an individual point
      return {
        properties: [clusterFeature.properties],
        center: clusterFeature.geometry.coordinates as [number, number],
        isCluster: false,
      };
    }
  });
  
  // Validate property count matches
  const totalPropertiesInResult = result.reduce((sum, item) => sum + item.properties.length, 0);
  if (totalPropertiesInResult !== validProperties.length) {
    console.warn(`⚠️ Property count mismatch! Valid properties: ${validProperties.length}, Clustered output: ${totalPropertiesInResult}`);
  }
  
  return result;
}

export function createClusterMarker(cluster: {
  properties: Property[];
  center: [number, number];
  isCluster: boolean;
}): mapboxgl.Marker {
  const el = document.createElement('div');
  

  if (cluster.isCluster) {
    // Cluster marker - use center anchor to prevent shifting
    el.className = 'cluster-marker';
    el.textContent = `${cluster.properties.length}`;
    
    return new mapboxgl.Marker({ 
      element: el,
      anchor: 'center' // Different anchor for cluster markers
    }).setLngLat(cluster.center);
  } else {
    // Single property marker - keep bottom anchor 
    const property = cluster.properties[0];
    el.className = 'price-marker';
    
    const { price, currency } = Currency(property.currency, property.price);
    el.textContent = property.type === 'rent' 
      ? `${currency}${price}/mo`
      : `${currency}${price}`;
    

    return new mapboxgl.Marker({ 
      element: el,
      anchor: 'bottom' // Keep bottom anchor for price markers
    }).setLngLat(cluster.center);
  }
}