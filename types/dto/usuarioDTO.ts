export class UsuarioDTO {
  id!: number;
  email!: string;
  nombre?: string;
  idRol!: number;
  fotoPerfil?: string | null;
}