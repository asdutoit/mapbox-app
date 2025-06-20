import { Show } from 'solid-js';
import type { Property } from '../../types/Property';
import { formatPrice, formatArea, formatPropertyType } from '../../utils/mapUtils';

interface PropertyPopupProps {
  property?: Property;
  isVisible: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
  position: { x: number; y: number };
}

export default function PropertyPopup(props: PropertyPopupProps) {
  return (
    <Show when={props.isVisible && props.property}>
      {(property) => (
        <div
          class="absolute z-50 pointer-events-auto"
          style={{
            left: `${props.position.x}px`,
            top: `${props.position.y}px`,
            transform: 'translate(-50%, -100%)',
            'margin-top': '-40px'  /* ← ADJUST THIS VALUE: More negative = higher above marker */
          }}
        >
          
          <div class="w-80 max-w-sm bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
            <div class="relative">
              <img
                src={property().image}
                alt={property().title}
                class="w-full h-40 object-cover"
              />
              <button
                onClick={props.onClose}
                class="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div class="absolute top-2 left-2">
                <span class={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  property().type === 'rent' 
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {property().type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>
            </div>
            
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-1">
                {property().title}
              </h3>
              <p class="mt-1 text-sm text-gray-600 line-clamp-1">
                {property().address}
              </p>
              
              <div class="mt-3 flex items-center gap-3 text-sm text-gray-600">
                <span class="flex items-center gap-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {property().bedrooms}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {property().bathrooms}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  {formatArea(property().area)}
                </span>
              </div>
              
              <div class="mt-3">
                <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                  {formatPropertyType(property().propertyType)}
                </span>
              </div>
              
              {property().description && (
                <p class="mt-3 text-sm text-gray-600 line-clamp-2">
                  {property().description}
                </p>
              )}
              
              <div class="mt-4 flex items-center justify-between">
                <p class="text-xl font-bold text-gray-900">
                  {formatPrice(property().price, property().type)}
                </p>
                {props.onViewDetails && (
                  <button 
                    onClick={props.onViewDetails}
                    class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}