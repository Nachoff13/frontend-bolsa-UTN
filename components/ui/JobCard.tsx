// components/JobCard.tsx
import styles from "@/styles/dashboard.module.css";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  ago: string;
  tag: string;
  type: "Full Time" | "Part Time";
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <article className={styles.jobCard}>
      <div className={styles.jobMain}>
        <div className={styles.jobTitle}>{job.title}</div>
        <div className={styles.jobMeta}>
          <span>🏢 {job.company}</span>
          <span>📍 {job.location}</span>
          <span>🕒 {job.ago}</span>
        </div>

        <div className={styles.jobTags}>
          <span className={styles.pillMuted}>{job.tag}</span>
          <span className={styles.pillAccent}>{job.type}</span>
        </div>
      </div>

      <div className={styles.jobActions}>
        <button className={styles.btnPrimary}>Ver detalles</button>
      </div>
    </article>
  );
}
