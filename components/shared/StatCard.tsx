"use client";

import { Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  value: string | number;
  subtitle?: string;
  rightSlot?: React.ReactNode; // opcional: icono o acción
};

export default function StatCard({ label, value, subtitle, rightSlot }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{ borderWidth: 2, borderColor: "primary.divider", borderRadius: 2 }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          {rightSlot}
        </Stack>
      </CardContent>
    </Card>
  );
}
