import React from 'react';
import { IconProps } from './types';
import LayersIcon from "../assets/images/layers_icon.webp";

export const Layers: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={LayersIcon} width={size} height={size}/>
  );
};
