import React from 'react';
import { IconProps } from './types';
import ImportExportIcon from "../assets/images/io_icon.webp";

export const ImportExport: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={ImportExportIcon} width={size} height={size}/>
  );
};
