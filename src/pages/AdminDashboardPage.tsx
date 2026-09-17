import { useNavigate } from "react-router-dom";
import { clearAdminToken } from "../utils/adminAuth";

export function AdminDashboardPage() {
  const navigate = useNavigate();

  function cerrarSesion() {
    clearAdminToken();
    navigate("/admin/login");
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel administrativo</h1>
      <p>Bienvenido. Aqui va el listado de confirmaciones y el catalogo.</p>
      <button type="button" onClick={cerrarSesion}>
        Cerrar sesion
      </button>
    </div>
  );
}
