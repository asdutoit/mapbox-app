import { createSignal, createEffect } from 'solid-js';
import type { PropertyFilters } from '../../types/Property';

interface FilterBarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  propertyCount: number;
}

export default function FilterBar(props: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = createSignal(false);
  const [showMobileFilters, setShowMobileFilters] = createSignal(false);
  const [priceRange, setPriceRange] = createSignal({ min: '', max: '' });

  // Initialize price range from filters
  createEffect(() => {
    setPriceRange({
      min: props.filters.minPrice?.toString() || '',
      max: props.filters.maxPrice?.toString() || ''
    });
  });

  const handleTypeChange = (type: 'all' | 'rent' | 'buy') => {
    props.onFiltersChange({
      ...props.filters,
      type: type === 'all' ? undefined : type
    });
  };

  const handleSearchChange = (search: string) => {
    props.onFiltersChange({
      ...props.filters,
      search: search || undefined
    });
  };

  const handleBedroomsChange = (bedrooms: string) => {
    props.onFiltersChange({
      ...props.filters,
      bedrooms: bedrooms ? Number(bedrooms) : undefined
    });
  };

  const handleBathroomsChange = (bathrooms: string) => {
    props.onFiltersChange({
      ...props.filters,
      bathrooms: bathrooms ? Number(bathrooms) : undefined
    });
  };

  const handlePropertyTypeChange = (propertyType: string) => {
    props.onFiltersChange({
      ...props.filters,
      propertyType: propertyType as any || undefined
    });
  };

  const handlePriceRangeChange = () => {
    const range = priceRange();
    props.onFiltersChange({
      ...props.filters,
      minPrice: range.min ? Number(range.min) : undefined,
      maxPrice: range.max ? Number(range.max) : undefined
    });
  };

  const clearAllFilters = () => {
    props.onFiltersChange({});
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = () => {
    const f = props.filters;
    return !!(f.search || f.type || f.bedrooms || f.bathrooms || f.propertyType || f.minPrice || f.maxPrice);
  };

  return (
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="p-4">
        {/* Mobile Filter Header */}
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold text-gray-900">
              <span class="hidden sm:inline">Filters</span>
              <span class="sm:hidden">Filter</span>
            </h2>
            <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {props.propertyCount}
            </span>
          </div>
          <div class="flex items-center gap-2">
            {hasActiveFilters() && (
              <button
                onClick={clearAllFilters}
                class="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Clear
              </button>
            )}
            {/* Mobile toggle button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters())}
              class="lg:hidden rounded-md p-2 text-gray-400 hover:text-gray-500"
            >
              <svg 
                class={`h-5 w-5 transition-transform ${showMobileFilters() ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Content - Horizontal layout for desktop */}
        <div class={`${showMobileFilters() ? 'block' : 'hidden'} lg:block`}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Property Type */}
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div class="grid grid-cols-3 gap-1">
                <button
                  onClick={() => handleTypeChange('all')}
                  class={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    !props.filters.type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleTypeChange('rent')}
                  class={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    props.filters.type === 'rent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rent
                </button>
                <button
                  onClick={() => handleTypeChange('buy')}
                  class={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    props.filters.type === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buy
                </button>
              </div>
            </div>

            {/* Search */}
            <div class="lg:col-span-2">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-2">
                Search Location
              </label>
              <input
                type="text"
                id="search"
                value={props.filters.search || ''}
                onInput={(e) => handleSearchChange(e.currentTarget.value)}
                placeholder="Search location..."
                class="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label for="bedrooms" class="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                id="bedrooms"
                value={props.filters.bedrooms || ''}
                onChange={(e) => handleBedroomsChange(e.currentTarget.value)}
                class="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label for="bathrooms" class="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                id="bathrooms"
                value={props.filters.bathrooms || ''}
                onChange={(e) => handleBathroomsChange(e.currentTarget.value)}
                class="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced())}
            class="flex items-center text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            <span>{showAdvanced() ? 'Hide' : 'Show'} advanced filters</span>
            <svg 
              class={`ml-1 h-4 w-4 transition-transform ${showAdvanced() ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Advanced Filters */}
          {showAdvanced() && (
            <div class="pt-4 border-t border-gray-200 space-y-4">
              {/* Property Type Detailed */}
              <div>
                <label for="propertyType" class="block text-sm font-medium text-gray-700 mb-2">
                  Property Category
                </label>
                <select
                  id="propertyType"
                  value={props.filters.propertyType || ''}
                  onChange={(e) => handlePropertyTypeChange(e.currentTarget.value)}
                  class="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Any Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={priceRange().min}
                    onInput={(e) => setPriceRange(prev => ({ ...prev, min: e.currentTarget.value }))}
                    onBlur={handlePriceRangeChange}
                    class="rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={priceRange().max}
                    onInput={(e) => setPriceRange(prev => ({ ...prev, max: e.currentTarget.value }))}
                    onBlur={handlePriceRangeChange}
                    class="rounded-md border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}