interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div class={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[props.size || 'md']} ${props.className || ''}`}></div>
  );
}