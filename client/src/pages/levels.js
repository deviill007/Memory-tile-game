import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/levels.module.css";

export default function Levels() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check-auth", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        console.log("Auth check response:", data);

        if (!data.isAuthenticated) {
          router.push("/login"); // Redirect if not authenticated
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login"); // Redirect on error
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  const startGame = (level) => {
    router.push(`/game?level=${level}`);
  };

  return (
    <div className={styles.levelsContainer}>
      <div className={styles.levelsCard}>
        <h1 className={styles.heading}>Select Difficulty</h1>
        <div className={styles.buttonContainer}>
          <button onClick={() => startGame("easy")} className={styles.button}>Easy (4x4)</button>
          <button onClick={() => startGame("medium")} className={styles.button}>Medium (6x6)</button>
          <button onClick={() => startGame("hard")} className={styles.button}>Hard (8x8)</button>
        </div>
      </div>
    </div>
  );
}
