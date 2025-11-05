export interface DashboardAdminDTO {
  metricas: MetricasDTO;
  cantidadCarreras: Record<string, number>;
  postulacionesPorMes: PostulacionesMesDTO[];
}

export interface MetricasDTO {
  ofertasPublicadas: number;
  postulacionesRecibidas: number;
  candidatosUnicos: number;
  ofertasActivas: number;
}

export interface PostulacionesMesDTO {
  mes: string;
  total: number;
}
