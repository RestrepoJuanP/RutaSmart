import React from 'react';

type StatusChipVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface StatusChipProps {
  label: string;
  variant: StatusChipVariant;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

const variantStyles: Record<StatusChipVariant, string> = {
  success: 'bg-[#34C759] bg-opacity-10 text-[#34C759] border-[#34C759]',
  warning: 'bg-[#FFCC00] bg-opacity-10 text-[#B8860B] border-[#FFCC00]',
  error: 'bg-[#FF3B30] bg-opacity-10 text-[#FF3B30] border-[#FF3B30]',
  info: 'bg-[#2A6DF4] bg-opacity-10 text-[#2A6DF4] border-[#2A6DF4]',
  neutral: 'bg-gray-100 text-gray-600 border-gray-300',
};

export function StatusChip({ label, variant, icon, size = 'md' }: StatusChipProps) {
  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </span>
  );
}
