import React from 'react';
import { IconProps } from './types';
import SettingsIcon from "../assets/images/settings_icon.webp";

export const Settings: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={SettingsIcon} width={size} height={size}/>
  );
};
