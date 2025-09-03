"use client"

import { Button, Card, CardContent, Typography } from "@mui/material"

export default function Home() {
  return (
    <Card sx={{ maxWidth: 400, m: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Bienvenido a la Bolsa de Trabajo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ahora la app usa MUI 🎉
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }}>
          Entrar
        </Button>
      </CardContent>
    </Card>
  )
}