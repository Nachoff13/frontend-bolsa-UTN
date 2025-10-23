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
      sx={{ 
        borderWidth: 2, 
        borderColor: "primary.divider", 
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}> {/* Aumentado de 2 a 3 */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack spacing={1}> {/* Aumentado de 0.5 a 1 */}
            <Typography variant="body1" color="text.secondary" fontWeight={500}> {/* Cambiado de subtitle2 a body1 */}
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={700}> {/* Cambiado de h5 a h4 */}
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary"> {/* Cambiado de caption a body2 */}
                {subtitle}
              </Typography>
            )}
          </Stack>
          {rightSlot && (
            <Box sx={{ fontSize: "2rem" }}> {/* Hacer iconos más grandes */}
              {rightSlot}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
