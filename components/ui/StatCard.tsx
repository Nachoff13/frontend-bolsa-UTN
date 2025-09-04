// components/Card.tsx
import styles from "@/styles/dashboard.module.css";

type Props = { icon?: string; title: string; value: string; footnote?: string };

export default function StatCard({ icon, title, value, footnote }: Props) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHead}>
        <span className={styles.statIcon}>{icon ?? "•"}</span>
        <span className={styles.statTitle}>{title}</span>
      </div>
      <div className={styles.statValue}>{value}</div>
      {footnote && <div className={styles.statFoot}>{footnote}</div>}
    </div>
  );
}
