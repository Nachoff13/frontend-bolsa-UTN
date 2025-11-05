// "use client";

// import { useEffect, useState } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Stack,
//   Typography,
// } from "@mui/material";
// import WorkIcon from "@mui/icons-material/Work";
// import PersonIcon from "@mui/icons-material/Person";
// import AssignmentIcon from "@mui/icons-material/Assignment";
// import SendIcon from "@mui/icons-material/Send";
// import { adminService } from "@/services/admin.service";
// import type { DashboardAdminDTO } from "@/types/dto/dashboardAdminDTO";
// import StatCard from "@/components/shared/StatCard";
// import LoadingModal from "@/components/shared/LoadingModal";
// import EmptyState from "@/components/shared/EmptyState";

// // 📊 Recharts
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";

// export default function DashboardAdminPage() {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<DashboardAdminDTO | null>(null);

//   // Estado para los contadores animados
//   const [counts, setCounts] = useState({
//     ofertasPublicadas: 0,
//     ofertasActivas: 0,
//     postulacionesRecibidas: 0,
//     candidatosUnicos: 0,
//   });

//   // 🎯 Animación numérica sin hooks externos
//   const animateCounts = (finalValues: typeof counts, duration = 1500) => {
//     const startTime = performance.now();

//     const step = (now: number) => {
//       const progress = Math.min((now - startTime) / duration, 1);

//       setCounts({
//         ofertasPublicadas: Math.floor(progress * finalValues.ofertasPublicadas),
//         ofertasActivas: Math.floor(progress * finalValues.ofertasActivas),
//         postulacionesRecibidas: Math.floor(progress * finalValues.postulacionesRecibidas),
//         candidatosUnicos: Math.floor(progress * finalValues.candidatosUnicos),
//       });

//       if (progress < 1) requestAnimationFrame(step);
//     };

//     requestAnimationFrame(step);
//   };

//   // 🚀 Cargar datos del dashboard
//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         setLoading(true);
//         const res = await adminService.dashboardAdmin();
//         setData(res);
//       } catch (err) {
//         console.error("Error al cargar dashboard:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboard();
//   }, []);

//   // 🧮 Iniciar animación cuando llegan las métricas
//   useEffect(() => {
//     if (data?.metricas) {
//       animateCounts({
//         ofertasPublicadas: data.metricas.ofertasPublicadas,
//         ofertasActivas: data.metricas.ofertasActivas,
//         postulacionesRecibidas: data.metricas.postulacionesRecibidas,
//         candidatosUnicos: data.metricas.candidatosUnicos,
//       });
//     }
//   }, [data]);

//   if (loading) return <LoadingModal open={true} />;
//   if (!data) return <EmptyState mensaje="No se pudieron cargar los datos." />;

//   const { postulacionesPorMes, cantidadCarreras } = data;

//   // Datos para gráficos
//   const chartPostulaciones = postulacionesPorMes.map((p) => ({
//     mes: p.mes.toUpperCase(),
//     total: p.total,
//   }));

//   const chartCarreras = Object.entries(cantidadCarreras).map(([nombre, total]) => ({
//     name: nombre,
//     value: total,
//   }));

//   const COLORS = ["#1976d2", "#388e3c", "#f57c00", "#6a1b9a", "#d32f2f"];

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" fontWeight={600} mb={3}>
//         Dashboard del Administrador
//       </Typography>

//       {/* 🔹 Métricas principales */}
//       <Stack
//         direction={{ xs: "column", sm: "row" }}
//         spacing={2}
//         justifyContent="space-between"
//         flexWrap="wrap"
//         mb={4}
//       >
//         <StatCard
//           label="Ofertas Publicadas"
//           value={counts.ofertasPublicadas}
//           rightSlot={<WorkIcon sx={{ color: "#1976d2", fontSize: 40 }} />}
//         />
//         <StatCard
//           label="Ofertas Activas"
//           value={counts.ofertasActivas}
//           rightSlot={<AssignmentIcon sx={{ color: "#388e3c", fontSize: 40 }} />}
//         />
//         <StatCard
//           label="Postulaciones Recibidas"
//           value={counts.postulacionesRecibidas}
//           rightSlot={<SendIcon sx={{ color: "#f57c00", fontSize: 40 }} />}
//         />
//         <StatCard
//           label="Candidatos Totales"
//           value={counts.candidatosUnicos}
//           rightSlot={<PersonIcon sx={{ color: "#6a1b9a", fontSize: 40 }} />}
//         />
//       </Stack>

//       {/* 🔹 Gráficos */}
//       <Stack
//         direction={{ xs: "column", md: "row" }}
//         spacing={3}
//         justifyContent="space-between"
//         alignItems="stretch"
//       >
//         {/* 📈 Postulaciones por Mes */}
//         <Box sx={{ flex: 1 }}>
//           <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight={600} mb={2}>
//                 Postulaciones por Mes
//               </Typography>
//               {chartPostulaciones.length === 0 ? (
//                 <EmptyState mensaje="Sin datos de postulaciones" />
//               ) : (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={chartPostulaciones}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="mes" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="total" fill="#1976d2" radius={[6, 6, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </CardContent>
//           </Card>
//         </Box>

//         {/* 🎓 Candidatos por Carrera */}
//         <Box sx={{ flex: 1 }}>
//           <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
//             <CardContent>
//               <Typography variant="h6" fontWeight={600} mb={2}>
//                 Candidatos por Carrera
//               </Typography>
//               {chartCarreras.length === 0 ? (
//                 <EmptyState mensaje="Sin información de carreras" />
//               ) : (
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={chartCarreras}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       innerRadius={60}
//                       label
//                     >
//                       {chartCarreras.map((_, i) => (
//                         <Cell
//                           key={i}
//                           fill={COLORS[i % COLORS.length]}
//                           stroke="white"
//                           strokeWidth={1}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               )}
//             </CardContent>
//           </Card>
//         </Box>
//       </Stack>
//     </Box>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { adminService } from "@/services/admin.service";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";

export default function DashboardTortaDual() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // 🎨 Colores para cada carrera (compartidos entre ambos anillos)
  const COLORS = [
    "#1976d2",
    "#0288d1",
    "#43a047",
    "#f57c00",
    "#6a1b9a",
    "#d32f2f",
    "#00796b",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminService.dashboardAdmin();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingModal open={true} />;
  if (!data) return <EmptyState mensaje="No hay datos." />;

  // 🎓 Carreras base
  const carreras = Object.keys(data.cantidadCarreras);

  // 🔵 Candidatos por carrera
  const candidatos = carreras.map((carrera) => ({
    name: carrera,
    value: data.cantidadCarreras[carrera],
    tipo: "Candidatos",
  }));

  // 🟢 Ofertas por carrera (simulado por ahora)
  const ofertas = carreras.map((carrera) => ({
    name: carrera,
    value: Math.floor(Math.random() * 10) + 1,
    tipo: "Ofertas",
  }));

  // Tooltip contextual por anillo
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const { name, value, tipo } = payload[0].payload;

    return (
      <Box
        sx={{
          bgcolor: "white",
          p: 1.5,
          border: "1px solid #ccc",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="body1" fontWeight={600}>
          {tipo === "Candidatos" ? "👨‍🎓 Candidatos" : "🏢 Ofertas"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {name}: {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Candidatos vs Ofertas por Carrera
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} />

            {/* 🟦 Candidatos - anillo interno */}
            <Pie
              data={candidatos}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              isAnimationActive
            >
              {candidatos.map((_, i) => (
                <Cell
                  key={`cand-${i}`}
                  fill={COLORS[i % COLORS.length]}
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
            </Pie>

            {/* 🟩 Ofertas - anillo externo */}
            <Pie
              data={ofertas}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={110}
              outerRadius={150}
              isAnimationActive
            >
              {ofertas.map((_, i) => (
                <Cell
                  key={`of-${i}`}
                  fill={COLORS[i % COLORS.length]} // mismo color = misma carrera
                  stroke="white"
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 📘 Leyendas debajo del gráfico */}
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          mt={2}
          flexWrap="wrap"
        >
          <Chip
            label="🟦 Anillo interno: Candidatos"
            variant="outlined"
            color="primary"
          />
          <Chip
            label="🟩 Anillo externo: Ofertas"
            variant="outlined"
            color="success"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
