import React from 'react';

interface SectionDividerProps {
  variant?: 'wave' | 'curve';
  topColor?: string;
  bottomColor?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({ 
  variant = 'wave',
  topColor = '#fdf9f3',
  bottomColor = '#ffffff'
}) => {
  if (variant === 'wave') {
    return (
      <div className="section-divider">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path 
            d="M0,64 C240,96 480,96 720,64 C960,32 1200,32 1440,64 L1440,120 L0,120 Z" 
            fill={bottomColor}
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="section-divider">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path 
          d="M0,96 Q360,32 720,64 T1440,96 L1440,120 L0,120 Z" 
          fill={bottomColor}
        />
      </svg>
    </div>
  );
};
