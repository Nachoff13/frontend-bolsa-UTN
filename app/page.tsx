"use client";

import { Button, Card, CardContent, Typography } from "@mui/material";

export default function Home() {
  return (
    <Card sx={{ maxWidth: 900, m: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Bienvenido a la Bolsa de Trabajo
        </Typography>

        <a href="/auth/login">Login</a>
      </CardContent>
    </Card>
  );
}
