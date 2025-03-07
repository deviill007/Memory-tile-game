import { makeAutoObservable } from "mobx";

class AuthStore {
  isAuthenticated = false;
  user = null;

  constructor() {
    makeAutoObservable(this);
    this.checkAuth(); // Check auth status when store initializes
  }

  async checkAuth() {
    try {
      const res = await fetch("http://localhost:5000/api/auth/check-auth", {
        method: "GET",
        credentials: "include", // Ensure cookies are sent
      });
      const data = await res.json();

      if (res.ok) {
        this.isAuthenticated = true;
        this.user = data.user;
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      this.isAuthenticated = false;
      this.user = null;
    }
  }

  async logout() {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      this.isAuthenticated = false;
      this.user = null;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
}

const authStore = new AuthStore();
export default authStore;
