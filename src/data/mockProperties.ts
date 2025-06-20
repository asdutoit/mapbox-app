import type { Property, PropertyFilters, MapBounds } from '../types/Property';

export const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Modern Downtown Apartment',
    price: 2500,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 950,
    address: '123 Main St, Downtown, CA 90012',
    coordinates: [-74.0060, 40.7128], // NYC
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    propertyType: 'apartment',
    description: 'Luxurious downtown apartment with stunning city views',
    amenities: ['Gym', 'Pool', 'Parking', 'Concierge']
  },
  {
    id: 2,
    title: 'Spacious Family Home',
    price: 750000,
    type: 'buy',
    bedrooms: 4,
    bathrooms: 3,
    area: 2200,
    address: '456 Oak Ave, Suburbs, CA 91011',
    coordinates: [-74.0020, 40.7589], // Upper West Side
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
    propertyType: 'house',
    description: 'Beautiful family home in quiet neighborhood with excellent schools',
    amenities: ['Garden', 'Garage', 'Fireplace', 'Storage']
  },
  {
    id: 3,
    title: 'Beach View Condo',
    price: 3800,
    type: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    address: '789 Ocean Blvd, Santa Monica, CA 90401',
    coordinates: [-73.9857, 40.7484], // Times Square
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
    propertyType: 'condo',
    description: 'Stunning beachfront condo with panoramic ocean views',
    amenities: ['Beach Access', 'Balcony', 'Gym', 'Security']
  },
  {
    id: 4,
    title: 'Cozy Studio Loft',
    price: 1800,
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    address: '321 Arts District Way, LA, CA 90013',
    coordinates: [-73.9442, 40.8176], // Bronx
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    propertyType: 'apartment',
    description: 'Trendy loft in the heart of the Arts District',
    amenities: ['High Ceilings', 'Exposed Brick', 'Rooftop Access']
  },
  {
    id: 5,
    title: 'Suburban Townhouse',
    price: 425000,
    type: 'buy',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    address: '555 Maple Dr, Pasadena, CA 91101',
    coordinates: [-73.9903, 40.7589], // Central Park
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=600&fit=crop',
    propertyType: 'house',
    description: 'Well-maintained townhouse in family-friendly community',
    amenities: ['HOA', 'Playground', 'Pool', 'Tennis Courts']
  },
  {
    id: 6,
    title: 'Luxury Penthouse',
    price: 8500,
    type: 'rent',
    bedrooms: 4,
    bathrooms: 4,
    area: 3000,
    address: '999 Wilshire Blvd, Beverly Hills, CA 90210',
    coordinates: [-74.0445, 40.6892], // Brooklyn
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    propertyType: 'apartment',
    description: 'Ultra-luxury penthouse with private elevator and terrace',
    amenities: ['Private Elevator', 'Wine Cellar', 'Home Theater', 'Smart Home']
  },
  {
    id: 7,
    title: 'Garden View Apartment',
    price: 2200,
    type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area: 850,
    address: '234 Park Lane, Glendale, CA 91205',
    coordinates: [-118.2551, 34.1425],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    propertyType: 'apartment',
    description: 'Charming apartment overlooking beautiful gardens',
    amenities: ['Garden View', 'Parking', 'Laundry', 'Pet Friendly']
  },
  {
    id: 8,
    title: 'Historic Bungalow',
    price: 625000,
    type: 'buy',
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    address: '876 Heritage St, South Pasadena, CA 91030',
    coordinates: [-118.1505, 34.1161],
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
    propertyType: 'house',
    description: 'Beautifully restored 1920s bungalow with modern amenities',
    amenities: ['Original Features', 'Updated Kitchen', 'Yard', 'Garage']
  }
];

export function filterProperties(properties: Property[], filters: PropertyFilters): Property[] {
  return properties.filter(property => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        property.title.toLowerCase().includes(searchLower) ||
        property.address.toLowerCase().includes(searchLower) ||
        property.description?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filters.type && filters.type !== 'all' && property.type !== filters.type) {
      return false;
    }

    if (filters.minPrice && property.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice && property.price > filters.maxPrice) {
      return false;
    }

    if (filters.bedrooms && property.bedrooms !== filters.bedrooms) {
      return false;
    }

    if (filters.bathrooms && property.bathrooms !== filters.bathrooms) {
      return false;
    }

    if (filters.propertyType && property.propertyType !== filters.propertyType) {
      return false;
    }

    return true;
  });
}

export function getPropertiesInBounds(properties: Property[], bounds: MapBounds): Property[] {
  return properties.filter(property => {
    const [lng, lat] = property.coordinates;
    return (
      lat >= bounds.south &&
      lat <= bounds.north &&
      lng >= bounds.west &&
      lng <= bounds.east
    );
  });
}

export function calculateBounds(properties: Property[]): MapBounds | null {
  if (properties.length === 0) return null;

  const lats = properties.map(p => p.coordinates[1]);
  const lngs = properties.map(p => p.coordinates[0]);

  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs)
  };
}