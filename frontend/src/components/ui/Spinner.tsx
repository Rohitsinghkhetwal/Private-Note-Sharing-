import type { SpinnerProps } from '@/types';

export default function Spinner({
  size = 'sm',
  color = 'white',
}: SpinnerProps) {
  const sizes: Record<NonNullable<SpinnerProps['size']>, string> = {
    xs: 'w-3 h-3 border',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
  };

  const colors: Record<NonNullable<SpinnerProps['color']>, string> = {
    white: 'border-white/20 border-t-white',
    green: 'border-brand-500/20 border-t-brand-500',
    gray:  'border-white/10 border-t-white/40',
  };

  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} />
  );
}
