"use client";

import { Backdrop, CircularProgress } from "@mui/material";
import { LoadingModalProps } from "@/types/Components/LoadingModalProps";

export default function LoadingModal({ open }: LoadingModalProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backdropFilter: "blur(2px)",
      }}
    >
      <CircularProgress color="primary" size={60} />
    </Backdrop>
  );
}