import { A } from '@solidjs/router';

export default function Landing() {
  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <section class="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find Your Perfect Property
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Discover amazing properties for rent or sale in your area. Our interactive map and advanced filters make finding your dream home easier than ever.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <A href="/search?type=buy" class="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
              Buy a Home
            </A>
            <A href="/search?type=rent" class="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Rent a Property
            </A>
          </div>
        </div>
      </section>

      <section class="py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose PropertyFinder?
            </h2>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              We make property searching simple, fast, and enjoyable
            </p>
          </div>
          <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div class="flex flex-col">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  Interactive Map Search
                </dt>
                <dd class="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p class="flex-auto">Explore properties visually on our interactive map with real-time updates and detailed markers.</p>
                </dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                  </div>
                  Advanced Filters
                </dt>
                <dd class="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p class="flex-auto">Filter by price, bedrooms, property type, and more to find exactly what you're looking for.</p>
                </dd>
              </div>
              <div class="flex flex-col">
                <dt class="text-base font-semibold leading-7 text-gray-900">
                  <div class="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  Instant Results
                </dt>
                <dd class="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p class="flex-auto">Get real-time search results as you type, with lightning-fast filtering and sorting.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section class="py-16 sm:py-24">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to start your search?
            </h2>
            <p class="mt-6 text-lg leading-8 text-gray-600">
              Browse all available properties or use our advanced search filters
            </p>
            <div class="mt-10">
              <A href="/search" class="rounded-md bg-gray-900 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">
                View All Properties
              </A>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}