"use client";

import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function FilterSearch({
  titulo,
  subtitulo,
  placeholder,
  valor,
  onChange,
  onAccion1,
  tituloBoton1 ="Buscar",
  tituloBoton2 = "Filtros",
  onAccion2,
  mostrarBotonFiltros = true,
}: FilterSearchProps) {
  return (
    <Card
      sx={{
        p: 4, // Aumentado de 3 a 4
        borderRadius: 3,
        boxShadow: 3,
        mb: 4,
        mt: 2,
      }}
    >
      <Stack spacing={1.5} mb={3}> {/* Aumentado spacing y mb */}
        <Stack direction="row" spacing={1.5} mb={0.5} alignItems="center">
          <SearchIcon fontSize="large" /> {/* Cambiado de medium a large */}
          <Typography variant="h4" fontWeight={600}> {/* Cambiado de h5 a h4 */}
            {titulo}
          </Typography>
        </Stack>
        {subtitulo && (
          <Typography variant="body1" color="text.secondary" sx={{ ml: 5, fontSize: "1.0625rem" }}> {/* Aumentado ml */}
            {subtitulo}
          </Typography>
        )}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch">
        <TextField
          fullWidth
          placeholder={placeholder}
          value={valor}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onAccion1?.();
            }
          }}
          size="medium" // Cambiado de small a medium
          InputProps={{
            sx: {
              borderRadius: 3,
              fontSize: "1rem", // Asegurar tamaño de fuente
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onAccion1}
          sx={{ minWidth: 140, height: "56px" }} // Aumentado minWidth y altura explícita
        >
          {tituloBoton1}
        </Button>

        {mostrarBotonFiltros && (
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={onAccion2}
            sx={{ height: "56px" }} // Altura explícita
          >
            {tituloBoton2}
          </Button>
        )}
      </Stack>
    </Card>
  );
}
