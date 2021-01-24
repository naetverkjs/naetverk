export interface SelectionOptions {
  enabled?: boolean;
  heightOffset: {
    x: number;
    y: number;
  };
  selectionArea?: {
    className?: string;
  };
  selectionMode?: {
    className?: string;
  };
  mode?: [string, string];
}
