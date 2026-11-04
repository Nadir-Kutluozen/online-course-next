import React from 'react';

// Small line icons. They take the text color, so they work on any block.
const Icon = ({ children, size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
    {children}
  </svg>
);

export const UpIcon = (p) => <Icon {...p}><path d="M6 15l6-6 6 6" /></Icon>;
export const DownIcon = (p) => <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>;
export const CheckIcon = (p) => <Icon {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Icon>;
export const CrossIcon = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;
export const BackIcon = (p) => <Icon {...p}><path d="M15 6l-6 6 6 6" /></Icon>;
export const OutIcon = (p) => <Icon {...p}><path d="M8 16L16 8M9 8h7v7" /></Icon>;
export const StarIcon = (p) => (
  <Icon {...p} fill="currentColor" strokeWidth="1.5">
    <path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
  </Icon>
);
