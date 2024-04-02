import React from 'react';
import { IconProps } from './types';
import AdminIcon from "../assets/images/admin_icon.webp";

export const Admin: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={AdminIcon} width={size} height={size}/>

  );
};
