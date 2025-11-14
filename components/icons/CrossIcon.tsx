
import React from 'react';

export const CrossIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 18 18"
      {...props}
    >
        <path d="M1 1l16 16M17 1L1 17"/>
    </svg>
);
