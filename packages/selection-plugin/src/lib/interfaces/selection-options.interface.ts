export interface SelectionOptions {
  enabled?: boolean;
  offset: {
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
