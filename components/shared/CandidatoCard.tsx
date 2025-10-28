"use client";

import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowDropDown as ArrowDropDownIcon,
  WorkOutline as WorkIcon,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";
import { useRouter } from "next/navigation";


interface CandidatoPostuladoCardProps {
  postulacion: PostulacionDTO;
  onVer?: (p: PostulacionDTO) => void;
  onCambiarEstado?: (p: PostulacionDTO, nuevoEstado: string) => void;
}

export default function CandidatoPostuladoCard({
  postulacion,
  onVer,
  onCambiarEstado,
}: CandidatoPostuladoCardProps) {
  const { nombreCandidato, tituloOferta, fechaPostulacion } = postulacion;
  const [estado, setEstado] = useState(postulacion.estadoPostulacion);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const getEstadoColor = (estado?: string) => {
    switch (estado?.toLowerCase()) {
      case "iniciada":
      case "en revisión":
        return "info";
      case "aceptada":
        return "success";
      case "rechazada":
        return "error";
      default:
        return "default";
    }
  };

  const router = useRouter();

  const mostrarNueva = estado?.toLowerCase() === "iniciada";

  const opciones = [
    { label: "En revisión", icon: <HourglassEmptyIcon fontSize="small" /> },
    { label: "Aceptada", icon: <CheckCircleOutlineIcon fontSize="small" /> },
    { label: "Rechazada", icon: <ErrorOutlineIcon fontSize="small" /> },
  ];

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = (nuevoEstado?: string) => {
    setAnchorEl(null);
    if (nuevoEstado) {
      setEstado(nuevoEstado);
      onCambiarEstado?.(postulacion, nuevoEstado);
    }
  };

  return (
    <div
      className="relative border border-neutral-200 rounded-xl bg-white shadow-sm 
                 hover:shadow-md transition-all duration-200 p-5"
    >
      {/* 🔹 Chips de estado */}
      <div className="absolute top-3 right-4 flex gap-2">
        {mostrarNueva && (
          <Chip
            label="Nueva"
            color="error"
            size="small"
            sx={{
              backgroundColor: "#d64141ff",
              color: "white",
              fontWeight: 600,
            }}
          />
        )}
        <Chip
          label={estado ?? "Sin estado"}
          color={getEstadoColor(estado) as any}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </div>

      {/* 🧑 Nombre del candidato */}
      <div className="flex items-center mb-2">
        <PersonIcon fontSize="small" className="text-sky-700 mr-1" />
        <h3 className="text-lg font-semibold text-sky-800">
          {nombreCandidato || "Candidato sin nombre"}
        </h3>
      </div>

      <Divider sx={{ mb: 1 }} />

      {/* 💼 Puesto */}
      <div className="flex items-center text-sm text-neutral-700 mb-2">
        <WorkIcon fontSize="small" className="mr-1 text-neutral-500" />
        <span className="font-medium">{tituloOferta || "Sin puesto"}</span>
      </div>

      {/* 📅 Fecha */}
      <div className="flex items-center text-sm text-neutral-500 mb-3">
        <CalendarIcon fontSize="small" className="mr-1 text-neutral-400" />
        <span>Postulado el {fechaPostulacion ?? "-"}</span>
      </div>

      <Divider sx={{ mb: 2 }} />

      {/* 🔘 Botones */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outlined"
          size="small"
          onClick={() => router.push("/empresa/candidatos-postulados")}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "#374151",
            px: 2.5,
          }}
        >
          Ver Postulaciones
        </Button>

        <Button
          variant="contained"
          size="small"
          onClick={handleClickMenu}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            backgroundColor: "#469ff3e0", // 💙 azul personalizado
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#1e40af", // tono más oscuro al hover
            },
          }}
        >
          Cambiar estado
        </Button>

      </div>

      {/* 📋 Menú de opciones */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleCloseMenu()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {opciones.map((op) => (
          <MenuItem key={op.label} onClick={() => handleCloseMenu(op.label)}>
            <ListItemIcon>{op.icon}</ListItemIcon>
            <ListItemText>{op.label}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
