export class UsuarioDTO {
  id!: number;
  email!: string;
  nombre?: string;
  idRol!: number;
  rolNombre!: string;
  activo!: string;
  fechaAlta!: string;
  fechaBaja!: string;
  fotoPerfil?: string | null;
}