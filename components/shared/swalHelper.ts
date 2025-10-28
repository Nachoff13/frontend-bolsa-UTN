import Swal from "sweetalert2";


export const showConfirmDialog = async (
  title: string,
  text: string,
  confirmText: string = "Confirmar",
  cancelText: string = "Cancelar",
  options?: {
    showCloseButton?: boolean; 
    allowOutsideClick?: boolean; 
  }
) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    showConfirmButton: true,
    reverseButtons: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: "#00658f",
    showCloseButton: options?.showCloseButton ?? false,
    allowOutsideClick: options?.allowOutsideClick ?? false,
  });
  return result.isConfirmed;
};

// 🔸 Éxito
export const showSuccess = (
  message: string,
  confirmButtonText: string = "Aceptar",
  title: string = "Éxito",
  options?: {
    showCloseButton?: boolean;
    allowOutsideClick?: boolean;
  }
) =>
  Swal.fire({
    icon: "success",
    title,
    text: message,
    confirmButtonText,
    confirmButtonColor: "#00658f",
    showConfirmButton: true,
    showCloseButton: options?.showCloseButton ?? false,
    allowOutsideClick: options?.allowOutsideClick ?? false,
  });

export const showError = (
  message: string,
  confirmButtonText: string = "Aceptar",
  title: string = "Error",
  options?: {
    showCloseButton?: boolean;
    allowOutsideClick?: boolean;
  }
) =>
  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText,
    confirmButtonColor: "#00658f",
    showConfirmButton: true,
    showCloseButton: options?.showCloseButton ?? false,
    allowOutsideClick: options?.allowOutsideClick ?? false,
  });

// 🔸 Información
export const showInfo = (
  message: string,
  confirmButtonText: string = "Aceptar",
  title: string = "Información",
  options?: {
    showCloseButton?: boolean;
    allowOutsideClick?: boolean;
  }
) =>
  Swal.fire({
    icon: "info",
    title,
    text: message,
    confirmButtonText,
    confirmButtonColor: "#00658f",
    showConfirmButton: true,
    showCloseButton: options?.showCloseButton ?? false,
    allowOutsideClick: options?.allowOutsideClick ?? false,
  });