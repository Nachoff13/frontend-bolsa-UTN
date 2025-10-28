
export interface PerfilCompletoDTO {

    idUsuario: number;
    email?: string | null;
    nombre?: string | null;
    idRol?: number | null;
    activo?: boolean | null;
    fechaAlta?: string | null;
    fechaBaja?: string | null;
    rolNombre?: string | null;

    //Datos de candidato
    descripcionCandidato?: string | null;
    nombreCarrera?: string | null;
    legajo?: string | null;
    genero?: string | null;

    //Datos de empresa
    descripcionEmpresa?: string | null;
    razonSocial?: string | null;
    cuit?: string | null;
    estadoValidacion?: string | null;

}

