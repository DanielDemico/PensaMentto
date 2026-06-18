declare module 'react-wordcloud' {
  import * as React from 'react';

  export interface Word {
    text: string;
    value: number;
  }

  export interface Options {
    colors?: string[];
    enableTooltip?: boolean;
    deterministic?: boolean;
    fontFamily?: string;
    fontSizes?: [number, number];
    fontStyle?: string;
    fontWeight?: string;
    padding?: number;
    rotations?: number;
    rotationAngles?: [number, number];
    scale?: 'sqrt' | 'log' | 'linear';
    spiral?: 'archimedean' | 'rectangular';
    transitionDuration?: number;
  }

  export interface ReactWordcloudProps {
    words: Word[];
    options?: Options;
    size?: [number, number];
  }

  const ReactWordcloud: React.FC<ReactWordcloudProps>;
  export default ReactWordcloud;
}
