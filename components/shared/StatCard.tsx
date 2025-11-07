"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  value: string | number;
  subtitle?: string;
  icono?: React.ReactNode; // 👈 nuevo prop
};

export default function StatCard({ label, value, subtitle, icono }: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderWidth: 2,
        borderColor: "divider",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        backgroundColor: "background.paper",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-3px)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 1 }}
        >
          {/* 🔹 Texto a la izquierda */}
          <Stack spacing={0.5}>
            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight={500}
            >
              {label}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>

          {/* 🔹 Ícono opcional a la derecha */}
          {icono && (
            <Box
              sx={{
                color: "text.secondary",
                fontSize: "2rem",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              {icono}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
