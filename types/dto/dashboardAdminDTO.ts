// DTO principal del dashboard administrador
export interface DashboardAdminDTO {
  metricas: MetricasDTO;
  postulacionesPorMes: PostulacionesMesDTO[];

  // 🎓 Distribuciones principales
  cantidadCandidatosPorCarrera: Record<string, number>;
  cantidadOfertasPorCarrera: Record<string, number>;

  // 👤 Distribuciones secundarias (opcionales)
  candidatosPorGenero?: Record<string, number>;
  empresasPorVerificacion?: Record<string, number>;
  ofertasPorTipoContrato?: Record<string, number>;
  ofertasPorModalidad?: Record<string, number>;
  ofertasPorLocalidad?: Record<string, number>;
}

// Métricas generales del dashboard (totales)
export interface MetricasDTO {
  // 🏢 Empresas
  empresasRegistradas: number;
  empresasVerificadas: number;
  empresasNoVerificadas: number;

  // 👨‍🎓 Candidatos
  candidatosRegistrados: number;           // Todos los perfiles activos
  candidatosConPostulaciones: number;      // Distintos candidatos que postularon al menos una vez

  // 📄 Ofertas
  ofertasPublicadas: number;
  ofertasActivas: number;

  // 💌 Postulaciones
  postulacionesRecibidas: number;

  // 🧩 Métricas específicas por carrera (si se mantienen)
  ofertasSistemas?: number;
  ofertasIndustrial?: number;
  ofertasElectrica?: number;
  ofertasCivil?: number;
  ofertasQuimica?: number;
  ofertasMecanica?: number;
}

// Serie temporal de postulaciones por mes
export interface PostulacionesMesDTO {
  mes: string;
  total: number;
}
