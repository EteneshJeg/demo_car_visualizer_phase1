import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./store/UserContext";
import { ImageProvider } from "./store/ImageContext.jsx";
import { ToastProvider } from "./store/ToastContext";
import App from "./App.jsx";
import axios from "axios";
import './assets/main.css'

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ImageProvider>
        <UserProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </UserProvider>
      </ImageProvider>
    </BrowserRouter>
  </StrictMode>
);
