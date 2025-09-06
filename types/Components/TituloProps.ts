// types/ui/titulo.ts
import { TypographyProps } from "@mui/material/Typography";

export interface TituloProps {
  titulo: string;
  subtitulo?: string;
  align?: "left" | "center" | "right";
  variantTitulo?: TypographyProps["variant"];
  variantSubtitulo?: TypographyProps["variant"];
}