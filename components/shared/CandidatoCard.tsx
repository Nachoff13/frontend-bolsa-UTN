"use client";

import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { PostulacionDTO } from "@/types/dto/postulacionDTO";

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

  // 🎨 Colores del chip de estado
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

  // 🟥 Mostrar "Nueva" si estado = Iniciada
  const mostrarNueva = estado?.toLowerCase() === "iniciada";

  // 📋 Opciones disponibles
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
    <div className="relative border border-neutral-200 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-all shadow-sm px-5 py-4">
      {/* 🔹 Chips superiores */}
      <div className="absolute top-3 right-4 flex gap-2">
        {mostrarNueva && (
          <Chip
            label="Nueva"
            color="error"
            size="small"
            sx={{
              backgroundColor: "#dc2626",
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

      {/* 👤 Nombre */}
      <div className="flex items-center mb-1">
        <PersonIcon fontSize="small" className="text-sky-700 mr-1" />
        <h3 className="text-base font-semibold text-sky-800">
          {nombreCandidato || "Candidato sin nombre"}
        </h3>
      </div>

      {/* 💼 Puesto */}
      <p className="text-sm text-neutral-600 mb-2">
        Puesto de <span className="font-medium">{tituloOferta || "Sin puesto"}</span>
      </p>

      {/* 📅 Fecha */}
      <div className="flex items-center text-sm text-neutral-500 mb-3">
        <CalendarIcon fontSize="small" className="mr-1" />
        <span>Postulado el {fechaPostulacion ?? "-"}</span>
      </div>

      {/* 🔘 Botones */}
      <div className="flex justify-between gap-2 mt-auto pt-2">
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => onVer?.(postulacion)}
          sx={{
            textTransform: "uppercase",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "#374151",
          }}
        >
          Ver
        </Button>

        {/* Botón desplegable */}
        <Button
          variant="outlined"
          size="small"
          fullWidth
          endIcon={<ArrowDropDownIcon />}
          onClick={handleClickMenu}
          sx={{
            textTransform: "uppercase",
            fontWeight: 600,
            borderColor: "#d1d5db",
            color: "#374151",
          }}
        >
          Cambiar estado
        </Button>

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
    </div>
  );
}
