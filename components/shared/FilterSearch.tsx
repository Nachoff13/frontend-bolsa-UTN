"use client";

import {
  Box,
  Button,
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
  onBuscar,
  onAbrirFiltros,
  mostrarBotonFiltros = true,
}: FilterSearchProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
        mb: 4,
        mt: 2,
      }}
    >
      <Stack spacing={1} mb={2}>
        <Stack direction="row" spacing={1} mb={0.5} alignItems="center">
          <SearchIcon fontSize="medium" />
          <Typography variant="h5" fontWeight={600}>
            {titulo}
          </Typography>
        </Stack>
        {subtitulo && (
          <Typography variant="body1" color="text.secondary" sx={{ ml: 4 }}>
            {subtitulo}
          </Typography>
        )}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          placeholder={placeholder}
          value={valor}
          onChange={onChange}
          size="small"
          InputProps={{
            sx: {
              borderRadius: 3, 
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={onBuscar}
          sx={{ minWidth: 120 }}
        >
          Buscar
        </Button>

        {mostrarBotonFiltros && (
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={onAbrirFiltros}
          >
            Filtros
          </Button>
        )}
      </Stack>
    </Box>
  );
}
