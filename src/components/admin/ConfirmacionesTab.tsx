import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { buscarConfirmaciones } from "../../api/confirmaciones";
import type { Confirmacion } from "../../types";
import { clearAdminToken, getAdminToken } from "../../utils/adminAuth";

export function ConfirmacionesTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [fecha, setFecha] = useState("");
  const [confirmaciones, setConfirmaciones] = useState<Confirmacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const timeout = setTimeout(() => {
      setCargando(true);
      setError(null);
      buscarConfirmaciones(token, { search, fecha })
        .then(setConfirmaciones)
        .catch((err) => {
          if (err instanceof ApiError && err.status === 401) {
            clearAdminToken();
            navigate("/admin/login");
            return;
          }
          setError("No se pudieron cargar las confirmaciones");
        })
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, fecha]);

  return (
    <div>
      <h2>Confirmaciones de asistencia</h2>

      <div className="admin-filtros">
        <input
          type="text"
          placeholder="Buscar por nombre, correo o documento"
          value={search}
          onChange={(evento) => setSearch(evento.target.value)}
        />
        <input
          type="date"
          value={fecha}
          onChange={(evento) => setFecha(evento.target.value)}
        />
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-tabla-wrapper">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Email</th>
              <th>Documento</th>
              <th>Fecha asistencia</th>
              <th>Desc. Servicios</th>
              <th>Desc. Productos</th>
              <th>Items seleccionados</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={7} className="admin-vacio">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando && confirmaciones.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-vacio">
                  Sin resultados
                </td>
              </tr>
            )}
            {!cargando &&
              confirmaciones.map((confirmacion) => (
                <tr key={confirmacion.id}>
                  <td>
                    {confirmacion.cliente.nombre}{" "}
                    {confirmacion.cliente.apellidos}
                  </td>
                  <td>{confirmacion.cliente.email}</td>
                  <td>{confirmacion.cliente.numeroDocumento}</td>
                  <td>
                    {new Date(confirmacion.fechaHoraEvento).toLocaleString(
                      "es-GT",
                    )}
                  </td>
                  <td>{confirmacion.descuentoServicios}%</td>
                  <td>{confirmacion.descuentoProductos}%</td>
                  <td>
                    {confirmacion.items
                      .map((ci) => ci.item.nombre)
                      .join(", ")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
