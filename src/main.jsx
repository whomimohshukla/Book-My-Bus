import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import { SocketProvider } from "./contexts/SocketProvider.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <SocketProvider>
      <BrowserRouter>
      <App />
    </BrowserRouter>
    </SocketProvider>
  </GoogleOAuthProvider>
);
