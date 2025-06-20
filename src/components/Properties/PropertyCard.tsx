import type { Property } from '../../types/Property';
import { formatPrice, formatArea, formatPropertyType } from '../../utils/mapUtils';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  isSelected?: boolean;
}

export default function PropertyCard(props: PropertyCardProps) {
  const handleViewDetails = () => {
    props.onViewDetails?.(props.property);
  };

  return (
    <div class={`overflow-hidden rounded-lg bg-white transition-all ${
      props.isSelected 
        ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' 
        : 'shadow-sm hover:shadow-md'
    }`}>
      <div class="aspect-w-16 aspect-h-9 relative">
        <img
          src={props.property.image}
          alt={props.property.title}
          class="h-40 sm:h-48 w-full object-cover"
        />
        <div class="absolute top-3 right-3">
          <span class={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            props.property.type === 'rent' 
              ? 'bg-blue-100 text-blue-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {props.property.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </div>
      
      <div class="p-3 sm:p-4">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">
              {props.property.title}
            </h3>
            <p class="mt-1 text-sm text-gray-600 line-clamp-1">
              {props.property.address}
            </p>
          </div>
        </div>
        
        <div class="mt-3 flex items-center gap-3 sm:gap-4 text-sm text-gray-600">
          <span class="flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {props.property.bedrooms} beds
          </span>
          <span class="flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {props.property.bathrooms} baths
          </span>
          <span class="flex items-center gap-1">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {formatArea(props.property.area)}
          </span>
        </div>
        
        <div class="mt-3 flex items-center gap-2">
          <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {formatPropertyType(props.property.propertyType)}
          </span>
          {props.property.amenities && props.property.amenities.length > 0 && (
            <span class="text-xs text-gray-500">
              +{props.property.amenities.length} amenities
            </span>
          )}
        </div>
        
        <div class="mt-4 flex items-center justify-between">
          <p class="text-lg sm:text-xl font-bold text-gray-900">
            {formatPrice(props.property.price, props.property.type)}
          </p>
          <button 
            onClick={handleViewDetails}
            class="rounded-md bg-gray-900 px-3 py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            <span class="hidden sm:inline">View Details</span>
            <span class="sm:hidden">Details</span>
          </button>
        </div>
        
        {props.property.description && (
          <p class="mt-3 text-sm text-gray-600 line-clamp-2">
            {props.property.description}
          </p>
        )}
      </div>
    </div>
  );
}