"use client";
import React from 'react';

export function Spinner({ size = 16, className = '' }: { size?: number; className?: string }) {
  const px = `${size}px`;
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent align-middle ${className}`}
      style={{ width: px, height: px }}
      aria-label="Loading"
      role="status"
    />
  );
}
