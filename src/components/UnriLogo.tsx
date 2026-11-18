import React from 'react';

interface UnriLogoProps {
  className?: string;
  size?: number;
}

export const UnriLogo: React.FC<UnriLogoProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="Lambang Resmi Universitas Riau"
    >
      {/* Outer Lotus 5-petal shield representing UNRI Emblem */}
      <circle cx="50" cy="50" r="47" fill="#003366" stroke="#D97706" strokeWidth="3" />
      <circle cx="50" cy="50" r="42" fill="#0A4275" stroke="#F59E0B" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="39" stroke="#FFFFFF" strokeDasharray="2 2" strokeWidth="1" />

      {/* Traditional Star / Shield base */}
      <polygon
        points="50,15 62,38 85,38 67,52 74,75 50,60 26,75 33,52 15,38 38,38"
        fill="#047857"
        stroke="#FCD34D"
        strokeWidth="1.2"
        opacity="0.85"
      />

      {/* Inner Central Disk */}
      <circle cx="50" cy="49" r="22" fill="#FFFFFF" stroke="#003366" strokeWidth="1.5" />

      {/* Traditional Lancang Kuning (Riau Royal Ship) & Education Torch */}
      {/* Ship Hull */}
      <path
        d="M36 53 C40 57, 60 57, 64 53 C62 58, 38 58, 36 53 Z"
        fill="#D97706"
        stroke="#B45309"
        strokeWidth="1"
      />
      {/* Mast & Sail */}
      <path d="M50 35 L50 51" stroke="#003366" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 36 C55 40, 58 45, 50 48 Z" fill="#F59E0B" opacity="0.9" />
      <path d="M50 38 C46 41, 44 45, 50 48 Z" fill="#FCD34D" opacity="0.85" />

      {/* Waves (Sungai Siak / Riau Waters) */}
      <path
        d="M33 60 C38 62, 44 58, 50 60 C56 62, 62 58, 67 60"
        stroke="#0284C7"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M35 63 C40 65, 45 61, 50 63 C55 65, 60 61, 65 63"
        stroke="#38BDF8"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* Open Book of Tri Dharma */}
      <path
        d="M42 49 C46 47, 49 48, 50 50 C51 48, 54 47, 58 49 L58 53 C54 51, 51 52, 50 54 C49 52, 46 51, 42 53 Z"
        fill="#003366"
      />

      {/* Bottom Ribbon / Banner */}
      <path
        d="M25 78 C35 74, 65 74, 75 78 L72 84 C63 80, 37 80, 28 84 Z"
        fill="#D97706"
        stroke="#B45309"
        strokeWidth="1"
      />
      <text
        x="50"
        y="81.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="5.5"
        fontWeight="bold"
        fontFamily="sans-serif"
        letterSpacing="0.8"
      >
        UNIVERSITAS RIAU
      </text>

      {/* Founded Year */}
      <text
        x="50"
        y="26"
        textAnchor="middle"
        fill="#FCD34D"
        fontSize="5"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        1962
      </text>
    </svg>
  );
};
