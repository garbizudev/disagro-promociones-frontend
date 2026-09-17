import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { activarItem, buscarItemsAdmin, desactivarItem } from "../../api/items";
import type { Item } from "../../types";
import { clearAdminToken, getAdminToken } from "../../utils/adminAuth";
import { ItemForm } from "./ItemForm";

export function ItemsTab() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Item | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [recargar, setRecargar] = useState(0);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const timeout = setTimeout(() => {
      setCargando(true);
      setError(null);
      buscarItemsAdmin(token, { search })
        .then(setItems)
        .catch((err) => {
          if (err instanceof ApiError && err.status === 401) {
            clearAdminToken();
            navigate("/admin/login");
            return;
          }
          setError("No se pudieron cargar los items");
        })
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, recargar]);

  async function toggleActivo(item: Item) {
    const token = getAdminToken();
    if (!token) {
      return;
    }
    if (item.activo) {
      await desactivarItem(token, item.id);
    } else {
      await activarItem(token, item.id);
    }
    setRecargar((n) => n + 1);
  }

  function abrirNuevo() {
    setEditando(null);
    setMostrarForm(true);
  }

  function abrirEditar(item: Item) {
    setEditando(item);
    setMostrarForm(true);
  }

  return (
    <div>
      <h2>Productos y Servicios</h2>

      <div className="admin-filtros">
        <input
          type="text"
          placeholder="Buscar producto o servicio"
          value={search}
          onChange={(evento) => setSearch(evento.target.value)}
        />
        <button type="button" className="boton-nuevo" onClick={abrirNuevo}>
          + Nuevo item
        </button>
      </div>

      {mostrarForm && (
        <ItemForm
          itemEditando={editando}
          onGuardado={() => {
            setMostrarForm(false);
            setRecargar((n) => n + 1);
          }}
          onCancelar={() => setMostrarForm(false)}
        />
      )}

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-tabla-wrapper">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={6} className="admin-vacio">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando && items.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-vacio">
                  Sin resultados
                </td>
              </tr>
            )}
            {!cargando &&
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.tipo === "SERVICIO" ? "Servicio" : "Producto"}</td>
                  <td>{item.nombre}</td>
                  <td>{item.descripcion ?? "-"}</td>
                  <td>Q{Number(item.precio).toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        item.activo ? "estado-activo" : "estado-inactivo"
                      }
                    >
                      {item.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="admin-acciones">
                    <button type="button" onClick={() => abrirEditar(item)}>
                      Editar
                    </button>
                    <button type="button" onClick={() => toggleActivo(item)}>
                      {item.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
