import React from 'react';
import { IconProps } from './types';
import SearchIcon from "../assets/images/search_icon.webp";

export const Search: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={SearchIcon} width={size} height={size}/>
  );
};
