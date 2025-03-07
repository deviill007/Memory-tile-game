import { useEffect } from "react";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import authStore from "../store/authStore";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    authStore.checkAuth(); //Check authentication on app load
  }, []);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
