import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/navbar.module.css";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication using cookies
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/check-auth", {
          method: "GET",
          credentials: "include", // Ensures cookies are sent
          cache: "no-store", // Prevent cached response
        });

        setIsLoggedIn(res.ok); // If response is 200 OK, user is authenticated
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [router.pathname]); // Re-run when route changes

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookie is cleared on logout
      });

      if (res.ok) {
        setIsLoggedIn(false);
        router.push("/login");
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Memory Tile Game</div>
      <div className={styles.links}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/levels" className={styles.link}>Levels</Link>
        <Link href="/leaderboard" className={styles.link}>Leaderboard</Link>
        <Link href="/myscore" className={styles.link}>My Scores</Link>

        {isLoggedIn ? (
          <button onClick={handleLogout} className={styles.btn}>
            Logout
          </button>
        ) : (
          <Link href="/login" className={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
}
