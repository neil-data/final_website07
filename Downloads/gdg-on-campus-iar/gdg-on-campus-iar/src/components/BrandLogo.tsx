import React from 'react';
import { cn } from '../hooks/useUtils';

type BrandLogoProps = {
  size?: number;
  className?: string;
};

export const BrandLogo = ({ size = 28, className }: BrandLogoProps) => {
  return (
    <svg
      width={size}
      height={(size * 130) / 180}
      viewBox="-20 -20 180 130"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-label="GDGOC Logo"
      role="img"
    >
      <g>
        <rect x="4" y="30" width="44" height="22" rx="11" transform="rotate(-33 4 30)" fill="#000000" />
        <rect x="4" y="45" width="44" height="22" rx="11" transform="rotate(33 4 45)" fill="#000000" />
        <rect x="92" y="8" width="44" height="22" rx="11" transform="rotate(33 92 8)" fill="#000000" />
        <rect x="92" y="70" width="44" height="22" rx="11" transform="rotate(-33 92 70)" fill="#000000" />
      </g>

      <g>
        <rect x="2" y="25" width="44" height="22" rx="11" transform="rotate(-33 2 25)" fill="#EA4335" stroke="#111827" strokeWidth="1.6" />
        <rect x="2" y="40" width="44" height="22" rx="11" transform="rotate(33 2 40)" fill="#4285F4" stroke="#111827" strokeWidth="1.6" />
        <rect x="90" y="3" width="44" height="22" rx="11" transform="rotate(33 90 3)" fill="#34A853" stroke="#111827" strokeWidth="1.6" />
        <rect x="90" y="65" width="44" height="22" rx="11" transform="rotate(-33 90 65)" fill="#FBBC04" stroke="#111827" strokeWidth="1.6" />
      </g>

      <g opacity="0.9">
        <rect x="14" y="47" width="17" height="4.2" rx="2.1" transform="rotate(33 14 47)" fill="white" />
        <rect x="34" y="60" width="8.5" height="4.2" rx="2.1" transform="rotate(33 34 60)" fill="white" />
        <rect x="102" y="12" width="17" height="4.2" rx="2.1" transform="rotate(33 102 12)" fill="white" />
        <rect x="122" y="25" width="8.5" height="4.2" rx="2.1" transform="rotate(33 122 25)" fill="white" />
      </g>
    </svg>
  );
};
