import {
  createSignal,
  createMemo,
  createResource,
  onMount,
  untrack,
  batch,
} from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { filterProperties, mockProperties } from "../data/mockProperties";
import type { PropertyFilters, Property } from "../types/Property";
import PropertyGrid from "../components/Properties/PropertyGrid";
import MapView from "../components/Map/MapView";
import FilterBar from "../components/Filters/FilterBar";
import PropertyDetailModal from "../components/Properties/PropertyDetailModal";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import ErrorMessage from "../components/Common/ErrorMessage";
import PropertySkeleton from "../components/Common/PropertySkeleton";

// Stable fetch function outside component to prevent recreation
const createStableFetchFunction = () => {
  let fetchAbortController: AbortController | null = null;

  return async (bounds?: {
    west: number;
    south: number;
    east: number;
    north: number;
  }): Promise<Property[]> => {
    console.log("🔥 Fetching properties with bounds:", bounds);

    try {
      // Cancel any previous request
      if (fetchAbortController) {
        fetchAbortController.abort();
      }

      // Create new abort controller for this request
      fetchAbortController = new AbortController();

      let url = "http://localhost:3000/api/listings/spatial";

      // Use provided bounds or default NYC bounds
      if (bounds) {
        const boundsParam = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
        url += `?bounds=${boundsParam}`;
      } else {
        // Default bounds for NYC area
        const defaultBounds = "-74.25909,40.477399,-73.700181,40.917577";
        url += `?bounds=${defaultBounds}`;
      }

      const response = await fetch(url, {
        signal: fetchAbortController.signal,
      });

      if (!response.ok) {
        console.warn(
          `API endpoint not found (${response.status}), using mock data`
        );
        return mockProperties;
      }

      const data = await response.json();
      console.log("📡 Fetched data from API:", data);

      // Transform GeoJSON FeatureCollection to Property array if needed
      if (data.type === "FeatureCollection" && data.features) {
        const transformedProperties = data.features
          .filter((feature: any) => feature.properties.price > 0)
          .map((feature: any, index: number) => {
            const props = feature.properties;
            const coords = feature.geometry.coordinates;

            return {
              id: props.id || props._id?.$oid || `property-${index}`,
              title: `Property in NYC - $${props.price}${
                props.currency === "USD" ? "" : " " + props.currency
              }`,
              price: props.price || 0,
              currency: props.currency,
              type: (props.type || "rent").toLowerCase() as "rent" | "buy",
              bedrooms: 2,
              bathrooms: 1,
              area: 1000,
              address: `${coords[1].toFixed(4)}°N, ${coords[0].toFixed(4)}°W`,
              coordinates: [coords[0], coords[1]] as [number, number],
              image:
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
              propertyType: "apartment" as const,
              description: `Property listed at ${
                props.currency
              } ${props.price.toLocaleString()}`,
              amenities: [],
            };
          });

        console.log(
          `✅ Transformed ${transformedProperties.length} properties from API`
        );
        return transformedProperties;
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Fetch aborted");
        return [];
      }

      console.warn("⚠️ API not available, using mock data:", error);
      return mockProperties;
    }
  };
};

// Create the stable fetch function once
const stableFetchProperties = createStableFetchFunction();

// Helper to check if bounds are significantly different
const areBoundsDifferent = (
  bounds1?: { west: number; south: number; east: number; north: number },
  bounds2?: { west: number; south: number; east: number; north: number }
): boolean => {
  if (!bounds1 || !bounds2) return true;

  const threshold = 0.0001; // Adjust based on your needs
  return (
    Math.abs(bounds1.west - bounds2.west) > threshold ||
    Math.abs(bounds1.south - bounds2.south) > threshold ||
    Math.abs(bounds1.east - bounds2.east) > threshold ||
    Math.abs(bounds1.north - bounds2.north) > threshold
  );
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProperty, setSelectedProperty] = createSignal<
    Property | undefined
  >();
  const [modalProperty, setModalProperty] = createSignal<
    Property | undefined
  >();
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [filters, setFilters] = createSignal<PropertyFilters>({
    type: (searchParams.type as "rent" | "buy") || undefined,
  });
  const [mapBounds, setMapBounds] = createSignal<
    { west: number; south: number; east: number; north: number } | undefined
  >();
  const [isMapReady, setIsMapReady] = createSignal(false);
  const [hasInitialFetch, setHasInitialFetch] = createSignal(false);
  const [lastFetchedBounds, setLastFetchedBounds] = createSignal<
    { west: number; south: number; east: number; north: number } | undefined
  >();
  const [allowBoundsFetch, setAllowBoundsFetch] = createSignal(false);

  // Property state management (separate from map bounds)
  const [properties, setProperties] = createSignal<Property[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  // Debounce timeout for bounds changes
  let boundsChangeTimeout: number | undefined;

  // Non-reactive fetch function to prevent loops
  const fetchData = async (bounds?: {
    west: number;
    south: number;
    east: number;
    north: number;
  }) => {
    // Prevent concurrent fetches
    if (isLoading()) {
      console.log("🚫 Fetch skipped - already loading");
      return;
    }

    console.log("🚀 Starting fetch with bounds:", bounds ? "defined" : "undefined");
    setIsLoading(true);
    setError(null);

    try {
      const newProperties = await stableFetchProperties(bounds);

      batch(() => {
        setProperties(newProperties);
        setIsLoading(false);
      });
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      batch(() => {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
        setIsLoading(false);
      });
    }
  };

  onMount(() => {
    if (searchParams.type) {
      setFilters({ type: searchParams.type as "rent" | "buy" });
    }
  });

  const filteredProperties = createMemo(() => {
    return filterProperties(properties(), filters());
  });

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);

    if (newFilters.type) {
      setSearchParams({ ...searchParams, type: newFilters.type });
    } else {
      setSearchParams({ ...searchParams, type: undefined });
    }
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    setModalProperty(property);
    setIsModalOpen(true);
  };

  const handleMapPropertyClick = (property: Property | undefined) => {
    setSelectedProperty(property);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchParams({});
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalProperty(undefined);
  };

  const handleMapBoundsChange = (bounds: {
    west: number;
    south: number;
    east: number;
    north: number;
  }) => {
    // Prevent updates if bounds haven't significantly changed
    const currentBounds = untrack(mapBounds);
    if (!areBoundsDifferent(currentBounds, bounds)) {
      console.log("📍 Bounds change ignored - not significant");
      return;
    }

    console.log("📍 Bounds change detected, allowBoundsFetch:", allowBoundsFetch());
    batch(() => {
      setMapBounds(bounds);

      // Only fetch if map is ready, bounds fetching is allowed, and bounds are different from last fetch
      if (
        isMapReady() &&
        allowBoundsFetch() &&
        areBoundsDifferent(untrack(lastFetchedBounds), bounds)
      ) {
        console.log("📍 Bounds change will trigger fetch");
        // Clear existing timeout
        if (boundsChangeTimeout) {
          clearTimeout(boundsChangeTimeout);
        }

        // Debounce the fetch
        boundsChangeTimeout = setTimeout(() => {
          setLastFetchedBounds(bounds);
          fetchData(bounds);
        }, 1000); // Reduced to 1 second for better UX
      }
    });
  };

  // Handler for when map is ready - triggers initial fetch (once only)
  const handleMapReady = () => {
    // Prevent multiple initial fetches
    if (hasInitialFetch()) {
      return;
    }

    setIsMapReady(true);
    setHasInitialFetch(true);

    // Get current bounds non-reactively and fetch data
    const currentBounds = untrack(mapBounds);
    fetchData(currentBounds);

    // Allow bounds-based fetching after a delay to prevent immediate double-fetch
    setTimeout(() => {
      setAllowBoundsFetch(true);
    }, 3000); // 3 seconds to allow initial load to settle
  };

  const [mobileView, setMobileView] = createSignal<"list" | "map">("list");

  return (
    <div
      class="bg-gray-50 flex flex-col overflow-hidden"
      style="height: calc(100vh - 4rem)"
    >
      {/* Header Section */}
      <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 flex-shrink-0">
        <div class="mx-auto max-w-7xl">
          <h1 class="text-2xl font-bold text-gray-900">Find Properties</h1>
          <p class="mt-1 text-sm text-gray-600">
            {isLoading()
              ? "Loading properties..."
              : error()
              ? "Unable to load properties"
              : `Search from ${properties().length} available properties`}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div class="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 flex-shrink-0">
        <div class="mx-auto max-w-7xl">
          <div class="flex items-center justify-between">
            <FilterBar
              filters={filters()}
              onFiltersChange={handleFiltersChange}
              propertyCount={filteredProperties().length}
            />

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchData(untrack(mapBounds))}
              disabled={isLoading()}
              class="ml-4 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading() ? (
                <>
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  <svg
                    class="-ml-1 mr-2 h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile View Switcher */}
      <div class="block lg:hidden bg-white border-b border-gray-200 px-4 py-2 flex-shrink-0">
        <div class="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setMobileView("map")}
            class={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mobileView() === "map"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setMobileView("list")}
            class={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mobileView() === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Properties ({filteredProperties().length})
          </button>
        </div>
      </div>

      {/* Main Content - Full Height Layout */}
      <div class="flex-1 flex overflow-hidden">
        {/* Mobile: Show either map or list */}
        <div class="block lg:hidden w-full">
          {mobileView() === "map" ? (
            <div class="h-full">
              {/* <MapView
                properties={filteredProperties()}
                selectedProperty={selectedProperty()}
                onPropertyClick={handleMapPropertyClick}
                onBoundsChange={handleMapBoundsChange}
                onMapReady={handleMapReady}
                className="h-full"
              /> */}
            </div>
          ) : (
            <div class="h-full overflow-y-auto p-4">
              {isLoading() && (
                <div class="flex flex-col items-center justify-center py-8">
                  <LoadingSpinner size="md" />
                  <p class="mt-3 text-sm text-gray-600">
                    Loading properties...
                  </p>
                </div>
              )}

              {error() && (
                <ErrorMessage
                  title="Failed to load properties"
                  message={error()!}
                  onRetry={() => fetchData(untrack(mapBounds))}
                />
              )}

              {!isLoading() && !error() && (
                <PropertyGrid
                  properties={filteredProperties()}
                  selectedProperty={selectedProperty()}
                  onPropertySelect={handlePropertySelect}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
          )}
        </div>

        {/* Desktop: Side-by-side layout */}
        <div class="hidden lg:flex w-full">
          {/* Map - Takes remaining space */}
          <div class="flex-1">
            <MapView
              properties={filteredProperties()}
              selectedProperty={selectedProperty()}
              onPropertyClick={handleMapPropertyClick}
              onBoundsChange={handleMapBoundsChange}
              onMapReady={handleMapReady}
              className="h-full"
            />
          </div>

          {/* Property List - Fixed width */}
          <div class="w-[600px] xl:w-[700px] flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto">
            <div class="p-6">
              {isLoading() && (
                <div class="flex flex-col items-center justify-center py-8">
                  <LoadingSpinner size="md" />
                  <p class="mt-3 text-sm text-gray-600">Loading properties...</p>
                </div>
              )}
              
              {error() && (
                <ErrorMessage
                  title="Failed to load properties"
                  message={error()!}
                  onRetry={() => fetchData(untrack(mapBounds))}
                />
              )}
              
              {!isLoading() && !error() && (
                <PropertyGrid
                  properties={filteredProperties()}
                  selectedProperty={selectedProperty()}
                  onPropertySelect={handlePropertySelect}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <PropertyDetailModal
        property={modalProperty()}
        isOpen={isModalOpen()}
        onClose={handleCloseModal}
      />
    </div>
  );
}
