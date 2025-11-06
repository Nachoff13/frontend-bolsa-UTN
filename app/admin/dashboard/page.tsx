"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import StatCard from "@/components/shared/StatCard";
import { adminService } from "@/services/admin.service";
import LoadingModal from "@/components/shared/LoadingModal";
import EmptyState from "@/components/shared/EmptyState";
import { DashboardAdminDTO } from "@/types/dto/dashboardAdminDTO";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SendIcon from "@mui/icons-material/Send";

import * as d3 from "d3";

/* ======================================================
   🎯 Componente D3: Donut dual (Candidatos vs Ofertas)
   ====================================================== */
type RingDatum = { name: string; value: number; tipo: "Candidatos" | "Ofertas" };

function DualDonutD3({
  candidatos,
  ofertas,
  getColor,
  height = 340,
}: {
  candidatos: RingDatum[];
  ofertas: RingDatum[];
  getColor: (name: string) => string;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);

  const baseNames = useMemo(() => {
    const set = new Set<string>();
    candidatos.forEach((d) => set.add(d.name));
    ofertas.forEach((d) => set.add(d.name));
    return Array.from(set);
  }, [candidatos, ofertas]);

  const candData = useMemo<RingDatum[]>(
    () =>
      baseNames.map((n) => {
        const found = candidatos.find((x) => x.name === n);
        return { name: n, value: found?.value ?? 0, tipo: "Candidatos" };
      }),
    [baseNames, candidatos]
  );

  const ofData = useMemo<RingDatum[]>(
    () =>
      baseNames.map((n) => {
        const found = ofertas.find((x) => x.name === n);
        return { name: n, value: found?.value ?? 0, tipo: "Ofertas" };
      }),
    [baseNames, ofertas]
  );

  useEffect(() => {
    if (!svgRef.current || !wrapRef.current || !tipRef.current) return;

    const container = wrapRef.current;
    const tip = tipRef.current;

    const width = container.clientWidth || 600;
    const outerRadius = Math.min(width, height) / 2 - 10;
    const innerRingR0 = outerRadius - 80;
    const innerRingR1 = outerRadius - 40;
    const outerRingR0 = outerRadius - 30;
    const outerRingR1 = outerRadius;

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height)
      .style("display", "block");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3
      .pie<RingDatum>()
      .value((d) => d.value)
      .sort(null);

    const arcInner = d3
      .arc<d3.PieArcDatum<RingDatum>>()
      .innerRadius(innerRingR0)
      .outerRadius(innerRingR1)
      .padAngle(0.01)
      .cornerRadius(3);

    const arcOuter = d3
      .arc<d3.PieArcDatum<RingDatum>>()
      .innerRadius(outerRingR0)
      .outerRadius(outerRingR1)
      .padAngle(0.01)
      .cornerRadius(3);

    const onMouseMove = (event: MouseEvent, d: d3.PieArcDatum<RingDatum>) => {
      const { pageX, pageY } = event;
      tip.style.display = "block";
      tip.style.left = pageX + 12 + "px";
      tip.style.top = pageY + 12 + "px";
      tip.innerHTML = `
        <div style="font-weight:600; margin-bottom:4px;">
          ${d.data.tipo === "Ofertas" ? "🏢 Ofertas" : "👨‍🎓 Candidatos"}
        </div>
        <div style="font-size:13px; color:#555;">${d.data.name}: ${d.data.value}</div>
      `;
    };
    const onMouseLeave = () => (tip.style.display = "none");

    // Anillo interno: Candidatos
    g.append("g")
      .selectAll("path")
      .data(pie(candData))
      .join("path")
      .attr("d", arcInner as any)
      .attr("fill", (d) => getColor(d.data.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mousemove", (event, d) => onMouseMove(event as any, d))
      .on("mouseleave", onMouseLeave);

    // Anillo externo: Ofertas
    g.append("g")
      .selectAll("path")
      .data(pie(ofData))
      .join("path")
      .attr("d", arcOuter as any)
      .attr("fill", (d) => getColor(d.data.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mousemove", (event, d) => onMouseMove(event as any, d))
      .on("mouseleave", onMouseLeave);
  }, [candidatos, ofertas, height, baseNames, getColor]);

  return (
    <Box ref={wrapRef} sx={{ position: "relative", width: "100%" }}>
      <svg ref={svgRef} />
      <Box
        ref={tipRef}
        sx={{
          position: "fixed",
          display: "none",
          pointerEvents: "none",
          bgcolor: "white",
          border: "1px solid #ccc",
          borderRadius: "8px",
          p: "8px 10px",
          boxShadow: 1,
          zIndex: 9999,
        }}
      />
    </Box>
  );
}

/* ======================================================
   📊 Página principal DashboardAdmin
   ====================================================== */
export default function DashboardAdminPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardAdminDTO | null>(null);
  const [counts, setCounts] = useState({
    ofertasPublicadas: 0,
    ofertasActivas: 0,
    postulacionesRecibidas: 0,
    candidatosRegistrados: 0,
    candidatosConPostulaciones: 0,
  });

  const theme = useTheme();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await adminService.dashboardAdmin();
        setData(res);
      } catch (err) {
        console.error("Error al cargar dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (data?.metricas) {
      const final = data.metricas;
      const start = performance.now();
      const duration = 900;
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        setCounts({
          ofertasPublicadas: Math.floor(p * final.ofertasPublicadas),
          ofertasActivas: Math.floor(p * final.ofertasActivas),
          postulacionesRecibidas: Math.floor(p * final.postulacionesRecibidas),
          candidatosRegistrados: Math.floor(p * final.candidatosRegistrados),
          candidatosConPostulaciones: Math.floor(p * final.candidatosConPostulaciones),
        });
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [data]);

  if (loading) return <LoadingModal open={true} />;
  if (!data) return <EmptyState mensaje="No se pudieron cargar los datos." />;

  const chartPostulaciones = data.postulacionesPorMes.map((p) => ({
    mes: p.mes?.toUpperCase?.() ?? "N/D",
    total: p.total,
  }));

  const carrerasCandidatos = Object.keys(data.cantidadCandidatosPorCarrera || {});
  const carrerasOfertas = Object.keys(data.cantidadOfertasPorCarrera || {});
  const carreras = Array.from(new Set([...carrerasCandidatos, ...carrerasOfertas]));

  const candidatosRing: RingDatum[] = carreras.map((name) => ({
    name,
    value: data.cantidadCandidatosPorCarrera?.[name] ?? 0,
    tipo: "Candidatos",
  }));

  const ofertasRing: RingDatum[] = carreras.map((name) => ({
    name,
    value: data.cantidadOfertasPorCarrera?.[name] ?? 0,
    tipo: "Ofertas",
  }));

  const tableau = d3.schemeTableau10;
  const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return hash;
  };

  const getColor = (name: string) =>
    (theme.palette as any).carreras?.[name] ||
    tableau[Math.abs(hashString(name)) % tableau.length];

  return (
    <div className="flex min-h-screen bg-[#f9fafa]">
      <main className="flex-1 p-4 md:p-6">
        {/* 🔹 Métricas principales */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5 mb-6">
          <StatCard
            label="Ofertas publicadas"
            value={counts.ofertasPublicadas}
            subtitle="totales"
            rightSlot={<WorkIcon sx={{ color: "#00658f", fontSize: 40 }} />}
          />
          <StatCard
            label="Empresas Registradas"
            value={data.metricas.empresasRegistradas}
            rightSlot={<AssignmentIcon sx={{ color: "#388e3c", fontSize: 40 }} />}
          />
          <StatCard
            label="Postulaciones recibidas"
            value={counts.postulacionesRecibidas}
            subtitle="en total"
            rightSlot={<SendIcon sx={{ color: "#f57c00", fontSize: 40 }} />}
          />
          <StatCard
            label="Candidatos registrados"
            value={counts.candidatosRegistrados}
            subtitle="activos"
            rightSlot={<PersonIcon sx={{ color: "#6a1b9a", fontSize: 40 }} />}
          />
          <StatCard
            label="Candidatos con postulaciones"
            value={counts.candidatosConPostulaciones}
            subtitle="únicos"
            rightSlot={<PersonIcon sx={{ color: "#1976d2", fontSize: 40 }} />}
          />
        </div>

        {/* 🔹 Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 📈 Postulaciones por Mes */}
          <Card sx={{ borderRadius: 3, boxShadow: 2, backgroundColor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Postulaciones por Mes
              </Typography>
              {chartPostulaciones.length === 0 ? (
                <EmptyState mensaje="Sin datos de postulaciones" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartPostulaciones}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <ReTooltip />
                    <Legend />
                    <Bar dataKey="total" fill={theme.palette.primary.main} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* 🎯 Candidatos vs Ofertas por Carrera */}
          <Card sx={{ borderRadius: 3, boxShadow: 2, backgroundColor: theme.palette.background.paper }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>
                Candidatos vs Ofertas por Carrera
              </Typography>

              {carreras.length === 0 ? (
                <EmptyState mensaje="Sin información de carreras" />
              ) : (
                <DualDonutD3 candidatos={candidatosRing} ofertas={ofertasRing} getColor={getColor} />
              )}

              <Stack direction="row" justifyContent="center" alignItems="center" spacing={3} mt={2} flexWrap="wrap">
                <Chip label="🟦 Anillo interno: Candidatos" variant="outlined" color="primary" />
                <Chip label="🟩 Anillo externo: Ofertas" variant="outlined" color="success" />
              </Stack>

              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5} mt={2} flexWrap="wrap">
                {carreras.map((carrera, i) => (
                  <Stack key={i} direction="row" alignItems="center" spacing={1}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: getColor(carrera),
                      }}
                    />
                    <Typography variant="body2">{carrera}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
