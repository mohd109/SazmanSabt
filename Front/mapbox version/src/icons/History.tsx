import React from 'react';
import { IconProps } from './types';
import HistoryIcon from "../assets/images/history_icon.webp";

export const History: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={HistoryIcon} width={size} height={size}/>
  );
};
