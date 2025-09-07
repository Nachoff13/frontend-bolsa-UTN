
"use client";

import { SkeletonLoaderProps } from "@/types/Components/SkeletonLoaderProps";
import { Skeleton, Stack, Box } from "@mui/material";



export default function SkeletonLoader({
  quantity = 1,
  variant = "text",
  width = "100%",
  height = 20,
  spacing = 2,
  direction = "column",
  borderRadius = 8,
}: SkeletonLoaderProps) {
  return (
    <Stack direction={direction} spacing={spacing}>
      {Array.from({ length: quantity }).map((_, i) => (
        <Box key={i}>
          <Skeleton
            variant={variant}
            width={width}
            height={height}
            sx={{ borderRadius }}
          />
        </Box>
      ))}
    </Stack>
  );
}