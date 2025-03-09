import React from 'react';
import { Box } from '@/components/ui/box';

interface ProgressCardProps {
  stepNumber: number;
}

export default function ProgressBar({ stepNumber }: ProgressCardProps) {
  return (
    <Box className='p-4 w-full justify-between flex-row gap-2'>
      <Box
        className={`border border-tertiary-400 h-2 flex-1 rounded-lg bg-tertiary-400`}
      ></Box>
      <Box
        className={`border border h-2 flex-1 rounded-lg ${
          stepNumber > 1
            ? `bg-tertiary-400 border-tertiary-400`
            : `bg-gray-300 border-gray-300`
        }`}
      ></Box>
      <Box
        className={`border border h-2 flex-1 rounded-lg ${
          stepNumber > 2
            ? `bg-tertiary-400 border-tertiary-400`
            : `bg-gray-300 border-gray-300`
        }`}
      ></Box>
      <Box
        className={`border border h-2 flex-1 rounded-lg ${
          stepNumber > 3
            ? `bg-tertiary-400 border-tertiary-400`
            : `bg-gray-300 border-gray-300`
        }`}
      ></Box>
    </Box>
  );
}
