interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div class={`rounded-lg bg-red-50 p-6 text-center ${props.className || ''}`}>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 class="mt-4 text-lg font-medium text-red-800">
        {props.title || 'Something went wrong'}
      </h3>
      <p class="mt-2 text-red-600">
        {props.message}
      </p>
      {props.onRetry && (
        <button
          onClick={props.onRetry}
          class="mt-4 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}