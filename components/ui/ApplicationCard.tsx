// components/ApplicationCard.tsx
import styles from "@/styles/dashboard.module.css";

export type Application = {
  id: string;
  title: string;
  company: string;
  status: "En revisión" | "Entrevista" | "Rechazada";
  date: string; // ej "21 Ago 2025"
};

const statusClass: Record<Application["status"], string> = {
  "En revisión": "badgeInfo",
  Entrevista: "badgeSuccess",
  Rechazada: "badgeDanger",
};

export default function ApplicationCard({
  application,
}: {
  application: Application;
}) {
  return (
    <article className={styles.appCard}>
      <div className={styles.appHeader}>
        <div className={styles.appTitle}>{application.title}</div>
        <span className={`${styles.badge} ${styles[statusClass[application.status]]}`}>
          {application.status}
        </span>
      </div>

      <div className={styles.appMeta}>
        <span>🏢 {application.company}</span>
        <span>🗓️ Postulado el {application.date}</span>
      </div>

      <button className={styles.btnGhost}>Ver estado</button>
    </article>
  );
}
