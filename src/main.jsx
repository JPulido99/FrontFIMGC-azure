//Archivo principal donde todo se renderiza

import React from "react";
import ReactDOM from "react-dom/client"; //librería para renderizar
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./Context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
