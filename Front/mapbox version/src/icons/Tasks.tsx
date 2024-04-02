import React from 'react';
import { IconProps } from './types';
import TasksIcon from "../assets/images/tasks_icon.webp";

export const Tasks: React.FC<IconProps> = ({ size = 18, ...rest }) => {
  return (
    <img src={TasksIcon} width={size} height={size}/>
  );
};
