import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GameBoard from "../components/GameBoard";
import styles from "../styles/game.module.css";

export default function Game() {
  const router = useRouter();
  const { level } = router.query;

  // Ensure level is valid
  const gridSizeMap = {
    easy: 4,
    medium: 6,
    hard: 8,
  };

  const gridSize = gridSizeMap[level] || 4;
  const [gameCompleted, setGameCompleted] = useState(false);
  const [finalTime, setFinalTime] = useState(0);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check-auth", {
          method: "GET",
          credentials: "include", // Sends HTTP-only cookie
        });

        const data = await res.json();
        console.log("Auth check response:", data);

        if (!data.isAuthenticated) {
          router.push("/login"); 
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]); 

  // save Score using HTTP cookie
  const handleGameComplete = async (time) => {
    try {
      console.log("Saving score with level:", level, "and time:", time);
  
      const res = await fetch("http://localhost:5000/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ level, time }),
      });
  
      if (!res.ok) {
        const responseData = await res.json();
        console.error("Failed to save score. Server response:", responseData);
        throw new Error(responseData.message || "Failed to save score");
      }
  
      console.log("✅ Score saved successfully!");
  
      // update finalTime to show correct value in UI
      setFinalTime(time);
      setGameCompleted(true);
    } catch (error) {
      console.error("❌ Error saving score:", error.message);
    }
  };
  
  

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.gameTitle}>
        Memory Tile Game - {level ? level.toUpperCase() : "EASY"} Mode
      </h1>

      {!gameCompleted ? (
        <GameBoard gridSize={gridSize} onGameComplete={handleGameComplete} />
      ) : (
        <div className={styles.gameOver}>
          <h2>🎉 Game Over! 🎉</h2>
          <p>Time: {finalTime}s</p>
          <button className={styles.btn} onClick={() => router.push("/levels")}>
            Play Again
          </button>
          <button className={styles.btn} onClick={() => router.push("/leaderboard")}>
            View Leaderboard
          </button>
        </div>
      )}
    </div>
  );
}