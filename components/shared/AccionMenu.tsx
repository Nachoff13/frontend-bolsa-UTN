"use client";

import { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface OpcionMenu {
  label: string;
  onClick: () => void;
}

interface AccionMenuProps {
  opciones: OpcionMenu[];
}

export default function AccionMenu({ opciones }: AccionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (accion: () => void) => {
    accion();
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {opciones.map((opcion, index) => (
          <MenuItem key={index} onClick={() => handleItemClick(opcion.onClick)}>
            {opcion.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}