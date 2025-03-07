import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/login.module.css";
import authStore from "../store/authStore"; // Import MobX store

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form from refreshing
  
    console.log("Login button clicked"); // Check if function runs
  
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Ensure cookies are sent
      });
  
      console.log("Response received:", res);
  
      const data = await res.json();
      console.log("Response data:", data);
  
      if (res.ok) {
        authStore.checkAuth(); // Update authentication state
        console.log("Login successful, redirecting...");
        router.push("/levels"); // Redirect after login
      } else {
        console.error("Login failed:", data.message);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className={styles.btn}>Login</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}
