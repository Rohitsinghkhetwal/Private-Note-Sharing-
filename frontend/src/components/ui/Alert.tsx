import type { AlertProps } from '@/types';

export default function Alert({ type = 'error', message }: AlertProps) {
  if (!message) return null;

  const styles: Record<NonNullable<AlertProps['type']>, string> = {
    error:   'bg-red-500/8 border-red-500/20 text-red-400',
    success: 'bg-brand-500/8 border-brand-500/20 text-brand-400',
    warning: 'bg-yellow-500/8 border-yellow-500/20 text-yellow-400',
    info:    'bg-blue-500/8 border-blue-500/20 text-blue-400',
  };

  const icons: Record<NonNullable<AlertProps['type']>, string> = {
    error:   '⚠',
    success: '✓',
    warning: '⚡',
    info:    'ℹ',
  };

  return (
    <div
      className={`flex items-start gap-3 border rounded-xl px-4 py-3 animate-slide-down ${styles[type]}`}
    >
      <span className="text-sm mt-0.5 flex-shrink-0">{icons[type]}</span>
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
