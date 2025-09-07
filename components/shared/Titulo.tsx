
import { TituloProps } from "@/types/Components/TituloProps";
import { Typography, Stack } from "@mui/material";

export default function Titulo({
  titulo,
  subtitulo,
  align = "left",
  variantTitulo = "h3",
  variantSubtitulo = "subtitle1",
}: TituloProps) {
  return (
    <Stack mt={2} mb={2} textAlign={align}>
      <Typography
        variant={variantTitulo}
        fontWeight="bold"
        color="text.primary"
      >
        {titulo}
      </Typography>
      {subtitulo && (
        <Typography variant={variantSubtitulo} color="text.secondary">
          {subtitulo}
        </Typography>
      )}
    </Stack>
  );
}
