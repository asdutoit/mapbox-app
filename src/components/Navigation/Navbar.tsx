import { A, useLocation } from '@solidjs/router';
import { createSignal } from 'solid-js';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <A href="/" class="flex items-center space-x-2">
              <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span class="text-xl font-bold text-gray-900">PropertyFinder</span>
            </A>
          </div>
          
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <A
              href="/"
              class={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                isActive('/')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Home
            </A>
            <A
              href="/search"
              class={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                isActive('/search')
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              Search
            </A>
          </div>
          
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <button class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Sign In
            </button>
          </div>
          
          <div class="flex sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
              class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span class="sr-only">Open main menu</span>
              {!mobileMenuOpen() ? (
                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div class={`sm:hidden ${mobileMenuOpen() ? 'block' : 'hidden'}`}>
        <div class="space-y-1 pb-3 pt-2">
          <A
            href="/"
            class={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
              isActive('/')
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </A>
          <A
            href="/search"
            class={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
              isActive('/search')
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Search
          </A>
        </div>
        <div class="border-t border-gray-200 pb-3 pt-4">
          <div class="px-4">
            <button class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}