interface Props {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
