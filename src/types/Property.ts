export interface Property {
  id: number;
  title: string;
  price: number;
  currency?: string;
  type: 'rent' | 'buy';
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  coordinates: [number, number]; // [longitude, latitude]
  image: string;
  propertyType: 'apartment' | 'house' | 'condo';
  description?: string;
  amenities?: string[];
}

export interface PropertyFilters {
  search?: string;
  type?: 'all' | 'rent' | 'buy';
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: Property['propertyType'];
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PropertyMarkerProps {
  property: Property;
  onClick?: (property: Property) => void;
}