import { useEffect, useState } from "react";
import styles from "../styles/myscores.module.css"; // ✅ Import CSS
import { useRouter } from "next/router"; // Add this for routing

export default function MyScores() {
  const [scores, setScores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    fetchMyScores();
  }, [currentPage]);

  const fetchMyScores = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/scores/myscore?page=${currentPage}&limit=10`,
        {
          method: "GET",
          credentials: "include", // ✅ Send cookies with request
          cache: "no-store", // ✅ Prevent caching issues
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          console.error("User is not authenticated. Redirecting to login.");
          router.push("/login"); // Redirect to login page
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return;
      }

      const data = await res.json();
      console.log("My Scores:", data);

      setScores(data.scores || []);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching user scores:", error);
    }
  };

  return (
    <div className={styles.myscoreContainer}>
      <h1 className={styles.title}>My Scores</h1>

      {scores.length > 0 ? (
        <>
          <table className={styles.myscoreTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Level</th>
                <th>Time (s)</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((entry, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{entry.level}</td>
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
        <p className={styles.noDataMessage}>No scores recorded yet.</p>
      )}
    </div>
  );
}