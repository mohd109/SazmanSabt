import React from 'react';
import { IconProps } from './types';

export const Github: React.FC<IconProps> = ({ size = 18,url, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...rest}
    >
       <img 
      src={url}
      alt="new"
      />
    </svg>
  );
};
