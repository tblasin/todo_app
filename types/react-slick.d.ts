// types/react-slick.d.ts
declare module 'react-slick' {
    import * as React from 'react';
  
    export interface Settings {
      dots?: boolean;
      infinite?: boolean;
      speed?: number;
      slidesToShow?: number;
      slidesToScroll?: number;
      nextArrow?: React.ReactNode;
      prevArrow?: React.ReactNode;
      [key: string]: any;
    }
  
    export default class Slider extends React.Component<Settings, any> {}
  }
  