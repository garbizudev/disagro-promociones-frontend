import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmacionesTab } from "../components/admin/ConfirmacionesTab";
import { ItemsTab } from "../components/admin/ItemsTab";
import { clearAdminToken } from "../utils/adminAuth";
import "./AdminDashboardPage.css";

type Tab = "confirmaciones" | "items";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("confirmaciones");

  function cerrarSesion() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h1>Disagro</h1>
          <p>Panel administrativo</p>
        </div>
        <button type="button" className="boton-salir" onClick={cerrarSesion}>
          Cerrar sesion
        </button>
      </header>

      <nav className="admin-tabs">
        <button
          type="button"
          className={tab === "confirmaciones" ? "activo" : ""}
          onClick={() => setTab("confirmaciones")}
        >
          Confirmaciones
        </button>
        <button
          type="button"
          className={tab === "items" ? "activo" : ""}
          onClick={() => setTab("items")}
        >
          Productos y Servicios
        </button>
      </nav>

      <main className="admin-contenido">
        {tab === "confirmaciones" ? <ConfirmacionesTab /> : <ItemsTab />}
      </main>
    </div>
  );
}
