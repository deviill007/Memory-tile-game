import { useRouter } from "next/router";
import styles from "../styles/home.module.css";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Memory Tile Game</h1>
        <button className={styles.playButton} onClick={() => router.push("/levels")}>
          Play
        </button>
      </div>
    </div>
  );
}
