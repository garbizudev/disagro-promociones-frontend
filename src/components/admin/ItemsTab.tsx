import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { activarItem, buscarItemsAdmin, desactivarItem } from "../../api/items";
import { SlideOver } from "../SlideOver/SlideOver";
import { Toast } from "../Toast/Toast";
import { useToast } from "../../hooks/useToast";
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
  const { mensaje, mostrarToast } = useToast();

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
      mostrarToast("Item desactivado");
    } else {
      await activarItem(token, item.id);
      mostrarToast("Item activado");
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

      <SlideOver
        open={mostrarForm}
        title={editando ? "Editar item" : "Nuevo item"}
        onClose={() => setMostrarForm(false)}
      >
        {mostrarForm && (
          <ItemForm
            key={editando?.id ?? "nuevo"}
            itemEditando={editando}
            onGuardado={() => {
              setMostrarForm(false);
              setRecargar((n) => n + 1);
              mostrarToast(editando ? "Item actualizado" : "Item creado");
            }}
            onCancelar={() => setMostrarForm(false)}
          />
        )}
      </SlideOver>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-tabla-wrapper">
        <table className="admin-tabla">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Activo</th>
              <th>Editar</th>
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
                    <label
                      className="toggle-switch"
                      title={item.activo ? "Desactivar" : "Activar"}
                    >
                      <input
                        type="checkbox"
                        checked={item.activo}
                        onChange={() => toggleActivo(item)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                  <td className="admin-acciones">
                    <button
                      type="button"
                      className="boton-icono"
                      onClick={() => abrirEditar(item)}
                      aria-label="Editar"
                      title="Editar"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Toast mensaje={mensaje} />
    </div>
  );
}
