import { For } from 'solid-js';

interface PropertySkeletonProps {
  count?: number;
}

export default function PropertySkeleton(props: PropertySkeletonProps) {
  const skeletonCount = props.count || 3;

  return (
    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
      <For each={Array(skeletonCount).fill(0)}>
        {() => (
          <div class="animate-pulse">
            <div class="overflow-hidden rounded-lg bg-white shadow-sm">
              {/* Image skeleton */}
              <div class="h-40 sm:h-48 bg-gray-200"></div>
              
              {/* Content skeleton */}
              <div class="p-3 sm:p-4 space-y-3">
                {/* Title and address */}
                <div class="space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                
                {/* Property details (beds, baths, area) */}
                <div class="flex gap-3 sm:gap-4">
                  <div class="h-3 bg-gray-200 rounded w-16"></div>
                  <div class="h-3 bg-gray-200 rounded w-16"></div>
                  <div class="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                
                {/* Amenities badge */}
                <div class="h-5 bg-gray-200 rounded w-24"></div>
                
                {/* Price and button */}
                <div class="flex justify-between items-center">
                  <div class="h-6 bg-gray-200 rounded w-20"></div>
                  <div class="h-8 bg-gray-200 rounded w-16 sm:w-24"></div>
                </div>
                
                {/* Description */}
                <div class="space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}