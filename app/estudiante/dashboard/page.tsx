// app/estudiante/page.tsx
import Sidebar from "@/components/shared/Sidebar";
import HeaderBar from "@/components/shared/Header";
import StatCard from "@/components/ui/StatCard";
import JobCard, { Job } from "@/components/ui/JobCard";
import ApplicationCard, { Application } from "@/components/ui/ApplicationCard";
import styles from "@/styles/dashboard.module.css";

export default function Page() {
  const jobs: Job[] = [
    {
      id: "1",
      title: "Data Engineer Trainee",
      company: "Digitlas Argentina",
      location: "Saavedra, CABA",
      ago: "3 días",
      tag: "Sistemas",
      type: "Part Time",
    },
    {
      id: "2",
      title: "Frontend Developer Jr.",
      company: "Mercap",
      location: "Montserrat, CABA",
      ago: "1 semana",
      tag: "Sistemas",
      type: "Full Time",
    },
    {
      id: "3",
      title: "Reiniciador de routers",
      company: "Puerto La Plata",
      location: "Ensenada",
      ago: "2 semanas",
      tag: "Sistemas",
      type: "Full Time",
    },
  ];

  const apps: Application[] = [
    {
      id: "a1",
      title: "Desarrollador Java Sr.",
      company: "Bricks",
      status: "En revisión",
      date: "21 Ago 2025",
    },
    {
      id: "a2",
      title: "Programa de Pasantías 2025",
      company: "JP Morgan",
      status: "Entrevista",
      date: "5 Ago 2025",
    },
    {
      id: "a3",
      title: "Otro laburo Jr.",
      company: "YPF",
      status: "Rechazada",
      date: "2 Ago 2025",
    },
  ];

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Sidebar />
      </aside>

      <main className={styles.main}>
        <HeaderBar />

        <h1 className={styles.h1}>Dashboard del Candidato</h1>
        <p className={styles.subtitle}>
          Bienvenido al portal de empleos de la UTN FRLP
        </p>

        {/* Métricas */}
        <section className={styles.statsGrid}>
          <StatCard
            icon="📝"
            title="Postulaciones activas"
            value="12"
            footnote="en proceso de revisión"
          />
          <StatCard
            icon="🗂️"
            title="Ofertas nuevas"
            value="8"
            footnote="este mes"
          />
          <StatCard
            icon="👤"
            title="Perfil completado"
            value="85%"
            footnote="completado"
          />
          <StatCard
            icon="📞"
            title="Entrevistas"
            value="3"
            footnote="programadas este mes"
          />
        </section>

        <section className={styles.columns}>
          {/* Publicaciones recientes */}
          <div className={styles.cardBlock}>
            <div className={styles.blockHeader}>
              <h2>Publicaciones de empleo recientes</h2>
              <span className={styles.blockSub}>Nuevas oportunidades laborales</span>
            </div>

            <div className={styles.stack}>
              {jobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          </div>

          {/* Mis postulaciones */}
          <div className={styles.cardBlock}>
            <div className={styles.blockHeader}>
              <h2>Mis postulaciones</h2>
              <span className={styles.blockSub}>Estado de mis aplicaciones</span>
            </div>

            <div className={styles.stack}>
              {apps.map((a) => (
                <ApplicationCard key={a.id} application={a} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
