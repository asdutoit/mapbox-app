import { Show, createEffect } from 'solid-js';
import type { JSX } from 'solid-js';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal(props: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  // Handle escape key
  createEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.isOpen) {
        props.onClose();
      }
    };

    if (props.isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  });

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Backdrop */}
          <div 
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={props.onClose}
          />
          
          {/* Modal panel */}
          <div class={`relative transform overflow-hidden rounded-t-lg sm:rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full w-full max-h-[90vh] overflow-y-auto ${sizeClasses[props.size || 'md']}`}>
            <Show when={props.title}>
              <div class="border-b border-gray-200 px-6 py-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {props.title}
                  </h3>
                  <button
                    onClick={props.onClose}
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </Show>
            
            <div class="px-6 py-4">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </Show>
  );
}