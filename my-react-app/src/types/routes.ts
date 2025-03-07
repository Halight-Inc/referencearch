// src/types/routes.ts
import { type LazyExoticComponent } from 'react';

export interface IRoute {
  path: string;
  exact?: boolean;
  name: string;
  element?: LazyExoticComponent<any>; // Or specify the exact component type if you know it
  items?: IRoute[];
  href?: string;
  badge?: {
    color: string;
    text: string;
  };
  icon?: any; // Or specify the exact icon type if you know it
  component?: any;
}
