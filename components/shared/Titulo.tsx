
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
    <Stack mt={3} mb={3} textAlign={align} spacing={1}>
      <Typography
        variant={variantTitulo}
        fontWeight="bold"
        color="text.primary"
        sx={{ lineHeight: 1.3 }}
      >
        {titulo}
      </Typography>
      {subtitulo && (
        <Typography 
          variant={variantSubtitulo} 
          color="text.secondary"
          sx={{ 
            fontSize: variantSubtitulo === "subtitle1" ? "1.125rem" : undefined,
            lineHeight: 1.5 
          }}
        >
          {subtitulo}
        </Typography>
      )}
    </Stack>
  );
}
