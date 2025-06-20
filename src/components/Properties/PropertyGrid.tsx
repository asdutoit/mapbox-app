import { For } from 'solid-js';
import type { Property } from '../../types/Property';
import PropertyCard from './PropertyCard';
import LoadingSpinner from '../Common/LoadingSpinner';

interface PropertyGridProps {
  properties: Property[];
  selectedProperty?: Property;
  onPropertySelect?: (property: Property) => void;
  loading?: boolean;
  emptyMessage?: string;
  onClearFilters?: () => void;
}

export default function PropertyGrid(props: PropertyGridProps) {
  const handlePropertySelect = (property: Property) => {
    props.onPropertySelect?.(property);
  };

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-gray-900">
          {props.loading ? 'Loading...' : `${props.properties.length} Properties Found`}
        </h2>
        {props.properties.length > 0 && (
          <div class="text-sm text-gray-500">
            Showing all results
          </div>
        )}
      </div>
      
      {props.loading ? (
        <div class="flex flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <p class="mt-3 text-sm text-gray-600">Loading properties...</p>
        </div>
      ) : props.properties.length > 0 ? (
        <div class="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
          <For each={props.properties}>
            {(property) => (
              <PropertyCard 
                property={property} 
                isSelected={props.selectedProperty?.id === property.id}
                onViewDetails={handlePropertySelect}
              />
            )}
          </For>
        </div>
      ) : (
        <div class="rounded-lg bg-white p-8 text-center shadow-sm">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
          <p class="mt-2 text-gray-600">
            {props.emptyMessage || "No properties match your current search criteria."}
          </p>
          {props.onClearFilters && (
            <button
              onClick={props.onClearFilters}
              class="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}