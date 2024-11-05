import React from 'react';
import { Status } from '../../types';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const statusColors = {
    'New': 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'On Hold': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]} ${className}`}>
      {status}
    </span>
  );
}