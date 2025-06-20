import { For } from 'solid-js';
import type { Property } from '../../types/Property';
import { formatPrice, formatArea, formatPropertyType } from '../../utils/mapUtils';
import Modal from '../Common/Modal';

interface PropertyDetailModalProps {
  property?: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailModal(props: PropertyDetailModalProps) {
  if (!props.property) return null;

  return (
    <Modal 
      isOpen={props.isOpen} 
      onClose={props.onClose}
      title={props.property.title}
      size="lg"
    >
      <div class="space-y-6">
        {/* Property Image */}
        <div class="aspect-w-16 aspect-h-9 relative">
          <img
            src={props.property.image}
            alt={props.property.title}
            class="w-full h-64 object-cover rounded-lg"
          />
          <div class="absolute top-4 right-4">
            <span class={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
              props.property.type === 'rent' 
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {props.property.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
        </div>

        {/* Property Details */}
        <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          <div class="space-y-4">
            <div>
              <h4 class="text-lg font-semibold text-gray-900">Property Details</h4>
              <div class="mt-2 space-y-2 text-sm text-gray-600">
                <div class="flex justify-between">
                  <span>Price:</span>
                  <span class="font-semibold text-gray-900">
                    {formatPrice(props.property.price, props.property.type)}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Type:</span>
                  <span>{formatPropertyType(props.property.propertyType)}</span>
                </div>
                <div class="flex justify-between">
                  <span>Area:</span>
                  <span>{formatArea(props.property.area)}</span>
                </div>
                <div class="flex justify-between">
                  <span>Bedrooms:</span>
                  <span>{props.property.bedrooms}</span>
                </div>
                <div class="flex justify-between">
                  <span>Bathrooms:</span>
                  <span>{props.property.bathrooms}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-gray-900">Location</h4>
              <p class="mt-2 text-sm text-gray-600">{props.property.address}</p>
            </div>
          </div>

          <div class="space-y-4">
            {props.property.description && (
              <div>
                <h4 class="text-lg font-semibold text-gray-900">Description</h4>
                <p class="mt-2 text-sm text-gray-600 leading-relaxed">
                  {props.property.description}
                </p>
              </div>
            )}

            {props.property.amenities && props.property.amenities.length > 0 && (
              <div>
                <h4 class="text-lg font-semibold text-gray-900">Amenities</h4>
                <div class="mt-2 flex flex-wrap gap-2">
                  <For each={props.property.amenities}>
                    {(amenity) => (
                      <span class="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {amenity}
                      </span>
                    )}
                  </For>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button class="flex-1 rounded-md bg-blue-600 px-4 py-3 sm:py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {props.property.type === 'rent' ? 'Schedule Viewing' : 'Request Info'}
          </button>
          <button class="flex-1 rounded-md border border-gray-300 bg-white px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Save to Favorites
          </button>
          <button class="rounded-md border border-gray-300 bg-white px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto w-full">
            <svg class="h-4 w-4 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>
      </div>
    </Modal>
  );
}