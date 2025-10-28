import { Grid, Typography } from "@mui/material";

export const Campo = ({ label, valor }: { label: string; valor?: string | null }) => {
  if (!valor) return null;
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="subtitle2" fontWeight="bold">{label}:</Typography>
      <Typography>{valor}</Typography>
    </Grid>
  );
};