import { useEffect, useState } from "react";
import styles from "../styles/leaderboard.module.css";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("easy");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedLevel, currentPage]);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/scores/leaderboard?level=${selectedLevel}&page=${currentPage}&limit=10`
      );
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      console.log("Leaderboard Data:", data);

      setLeaderboard(data.scores || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  return (
    <div className={styles.leaderboardContainer}>
      <h1 className={styles.title}>Leaderboard</h1>

      {/* Dropdown */}
      <label className={styles.label}>
        Select Level:{" "}
        <select
          className={styles.dropdown}
          value={selectedLevel}
          onChange={(e) => {
            setSelectedLevel(e.target.value);
            setCurrentPage(1); // Reset to first page on level change
          }}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      {/* Leaderboard Table */}
      {leaderboard.length > 0 ? (
        <>
          <table className={styles.leaderboardTable}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className={styles.noDataMessage}>
          No data available yet for {selectedLevel} mode.
        </p>
      )}
    </div>
  );
}
