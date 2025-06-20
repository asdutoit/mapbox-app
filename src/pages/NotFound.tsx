import { A } from '@solidjs/router';

export default function NotFound() {
  return (
    <div class="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div class="mx-auto max-w-max">
        <main class="sm:flex">
          <p class="text-4xl font-bold text-blue-600 sm:text-5xl">404</p>
          <div class="sm:ml-6">
            <div class="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              <p class="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <A
                href="/"
                class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go back home
              </A>
              <A
                href="/search"
                class="inline-flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Search properties
              </A>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}