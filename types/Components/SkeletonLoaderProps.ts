
export interface SkeletonLoaderProps {
  quantity?: number;
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  spacing?: number;
  direction?: SkeletonDirection;
  borderRadius?: number;
};

export type SkeletonVariant = "text" | "rectangular" | "circular";
export type SkeletonDirection = "row" | "column";