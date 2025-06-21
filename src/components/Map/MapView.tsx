import { createEffect, createSignal, onCleanup, onMount, on } from "solid-js";
import mapboxgl from "mapbox-gl";
import type { Property } from "../../types/Property";
import {
  createPropertyMarker,
  fitMapToBounds,
  clusterProperties,
  createClusterMarker,
} from "../../utils/mapUtils";
import PropertyPopup from "./PropertyPopup";

interface MapViewProps {
  properties: Property[];
  selectedProperty?: Property;
  onPropertyClick?: (property: Property | undefined) => void;
  onBoundsChange?: (bounds: {
    west: number;
    south: number;
    east: number;
    north: number;
  }) => void;
  onMapReady?: () => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function MapView(props: MapViewProps) {
  let mapContainer: HTMLDivElement;
  const [map, setMap] = createSignal<mapboxgl.Map | null>(null);
  const [markers, setMarkers] = createSignal<mapboxgl.Marker[]>([]);
  const [currentZoom, setCurrentZoom] = createSignal(9);
  const [popupProperty, setPopupProperty] = createSignal<
    Property | undefined
  >();
  const [popupPosition, setPopupPosition] = createSignal({ x: 0, y: 0 });
  const [lastSelectionSource, setLastSelectionSource] = createSignal<
    "marker" | "external"
  >("external");
  const [hasAutoFitted, setHasAutoFitted] = createSignal(false);
  const [isMapMoving, setIsMapMoving] = createSignal(false);
  const [isInitialized, setIsInitialized] = createSignal(false);

  // Function to update popup position based on marker coordinates
  const updatePopupPosition = () => {
    const property = popupProperty();
    const mapInstance = map();
    if (!property || !mapInstance || !mapContainer) return;

    // Convert property coordinates to screen position
    const point = mapInstance.project(property.coordinates);
    setPopupPosition({ x: point.x, y: point.y });
  };

  // Helper to emit bounds change safely
  const emitBoundsChange = (mapInstance: mapboxgl.Map) => {
    if (!isInitialized() || isMapMoving()) {
      return;
    }

    const bounds = mapInstance.getBounds();
    props.onBoundsChange?.({
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    });
  };

  onMount(() => {
    // Set Mapbox access token
    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error(
        "Mapbox access token is required. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file."
      );
      return;
    }

    mapboxgl.accessToken = token;

    // Initialize map
    const mapInstance = new mapboxgl.Map({
      container: mapContainer,
      style: "mapbox://styles/mapbox/streets-v12",
      center: props.center || [-74.006, 40.7128], // Default to NYC (Manhattan)
      zoom: props.zoom || 9,
      cooperativeGestures: false, // Allow mouse wheel zoom without modifier keys
    });

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Track when map is moving
    mapInstance.on("movestart", () => {
      setIsMapMoving(true);
    });

    mapInstance.on("moveend", () => {
      setIsMapMoving(false);
      updatePopupPosition();

      // Only emit bounds change if map is initialized and we're not in the middle of auto-fitting
      if (isInitialized() && hasAutoFitted()) {
        emitBoundsChange(mapInstance);
      }
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);

      // Wait a bit for map to settle, then mark as initialized
      setTimeout(() => {
        setIsInitialized(true);

        // Call onMapReady if provided
        if (props.onMapReady) {
          props.onMapReady();
        }

        // Emit initial bounds only after initialization
        emitBoundsChange(mapInstance);
      }, 100);
    });

    // Track zoom changes for clustering
    mapInstance.on("zoom", () => {
      setCurrentZoom(mapInstance.getZoom());
    });

    // Close popup and deselect on map click (but not drag)
    mapInstance.on("click", (e) => {
      // Only close if clicking on the map itself, not on markers
      if (e.defaultPrevented) return;
      setPopupProperty(undefined);
      props.onPropertyClick?.(undefined); // Also deselect the property
    });

    // Update popup position during map movements
    mapInstance.on("move", updatePopupPosition);

    onCleanup(() => {
      mapInstance.remove();
    });
  });

  // Update markers when properties or zoom changes (for clustering)
  createEffect(
    on(
      [map, () => props.properties, currentZoom],
      ([mapInstance, currentProperties, zoom]) => {
        if (!mapInstance || !currentProperties) return;

        // Clear existing markers
        markers().forEach((marker) => marker.remove());

        // Create clusters based on current zoom level
        const clusters = clusterProperties(currentProperties, zoom);

        // Check if the current popup property is now clustered
        const currentPopupProp = popupProperty();
        if (currentPopupProp) {
          const isPropertyClustered = clusters.some(
            (cluster) =>
              cluster.isCluster &&
              cluster.properties.some((prop) => prop.id === currentPopupProp.id)
          );

          if (isPropertyClustered) {
            setPopupProperty(undefined);
          }
        }

        // Add markers for clusters
        const newMarkers = clusters.map((cluster) => {
          const marker = createClusterMarker(cluster);
          const element = marker.getElement();

          // Store property ID on marker element for easier selection matching
          if (!cluster.isCluster) {
            element.setAttribute(
              "data-property-id",
              cluster.properties[0].id.toString()
            );
          }

          // Add click handler
          element.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent map click event

            if (cluster.isCluster) {
              // Close popup, deselect property, and zoom in on cluster
              setPopupProperty(undefined);
              props.onPropertyClick?.(undefined); // Deselect the property
              mapInstance.flyTo({
                center: cluster.center,
                zoom: Math.min(zoom + 2, 18),
                duration: 1000,
              });
            } else {
              // Single property click - toggle selection and popup
              const property = cluster.properties[0];
              const selectedProp = props.selectedProperty;

              if (
                selectedProp &&
                selectedProp.id === property.id &&
                popupProperty()
              ) {
                // If clicking on already selected property with popup open, close popup and deselect
                setPopupProperty(undefined);
                props.onPropertyClick?.(undefined);
              } else {
                // Select the property and show popup
                setLastSelectionSource("marker"); // Mark as marker selection
                props.onPropertyClick?.(property);
                setPopupProperty(property);

                // Calculate initial popup position using map coordinates
                updatePopupPosition();
              }
            }
          });

          marker.addTo(mapInstance);
          return marker;
        });

        setMarkers(newMarkers);

        // Apply selection styling to newly created markers
        const selectedProp = props.selectedProperty;
        if (selectedProp) {
          newMarkers.forEach((marker) => {
            const element = marker.getElement();
            if (element.classList.contains("price-marker")) {
              const propertyId = element.getAttribute("data-property-id");
              if (propertyId === selectedProp.id.toString()) {
                element.classList.add("selected");
              }
            }
          });
        }

        // Auto-fit disabled to prevent unwanted zoom/pan behavior
        // Users can manually navigate the map and use refresh to get new data
        // 
        // if (
        //   currentProperties.length > 0 &&
        //   !hasAutoFitted() &&
        //   isInitialized()
        // ) {
        //   console.log("🔍 Auto-fitting map to show", currentProperties.length, "properties");
        //   setHasAutoFitted(true);
        //   setTimeout(() => {
        //     fitMapToBounds(mapInstance, currentProperties);
        //   }, 100);
        // }
      }
    )
  );

  // Handle selected property highlighting
  createEffect(
    on(
      [map, () => props.selectedProperty, markers],
      ([mapInstance, selectedProp, currentMarkers]) => {
        if (!mapInstance) return;

        // Update selected class on all markers
        currentMarkers.forEach((marker) => {
          const element = marker.getElement();
          element.classList.remove("selected");

          // Check if this marker represents the selected property
          if (selectedProp && element.classList.contains("price-marker")) {
            const propertyId = element.getAttribute("data-property-id");
            if (propertyId === selectedProp.id.toString()) {
              element.classList.add("selected");
            }
          }
        });

        // Reset selection source for next selection
        if (selectedProp) {
          setLastSelectionSource("external");
        }
      }
    )
  );

  // Update popup position when popup property changes
  createEffect(() => {
    if (popupProperty()) {
      updatePopupPosition();
    }
  });

  const handleClosePopup = () => {
    setPopupProperty(undefined);
  };

  const handleViewDetails = () => {
    const property = popupProperty();
    if (property) {
      // You can add logic here to open the full property modal
      setPopupProperty(undefined);
      // For now, we'll just close the popup
    }
  };

  return (
    <div class={`relative ${props.className || "h-full w-full"}`}>
      <div ref={mapContainer!} class="h-full w-full rounded-lg" />

      {/* Property Popup */}
      <PropertyPopup
        property={popupProperty()}
        isVisible={!!popupProperty()}
        position={popupPosition()}
        onClose={handleClosePopup}
        onViewDetails={handleViewDetails}
      />

      {/* Loading indicator */}
      {!map() && (
        <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p class="mt-2 text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Error message if no token */}
      {!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN && (
        <div class="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div class="text-center p-6">
            <svg
              class="mx-auto h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-red-800">
              Mapbox Token Required
            </h3>
            <p class="mt-1 text-sm text-red-600">
              Please add your Mapbox access token to the .env file
            </p>
          </div>
        </div>
      )}

      {/* Empty state when no properties */}
      {map() && props.properties.length === 0 && (
        <div class="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm mx-auto">
          <div class="flex items-center space-x-3">
            <svg
              class="h-10 w-10 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <h3 class="text-sm font-medium text-gray-900">
                No properties found
              </h3>
              <p class="text-sm text-gray-500">
                Try adjusting your search area or filters
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
