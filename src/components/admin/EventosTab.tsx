import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import {
  activarEvento,
  buscarEventosAdmin,
  desactivarEvento,
} from "../../api/eventos";
import { Pagination } from "../Pagination/Pagination";
import { SlideOver } from "../SlideOver/SlideOver";
import { Toast } from "../Toast/Toast";
import { useToast } from "../../hooks/useToast";
import type { Evento } from "../../types";
import { clearAdminToken, getAdminToken } from "../../utils/adminAuth";
import { EventoForm } from "./EventoForm";

const PAGE_SIZE = 10;

export function EventosTab() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editando, setEditando] = useState<Evento | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [recargar, setRecargar] = useState(0);
  const { mensaje, mostrarToast } = useToast();

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate("/admin/login");
      return;
    }

    setCargando(true);
    setError(null);
    buscarEventosAdmin(token, { page, pageSize: PAGE_SIZE })
      .then((resultado) => {
        setEventos(resultado.data);
        setTotalPages(resultado.totalPages);
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearAdminToken();
          navigate("/admin/login");
          return;
        }
        setError("No se pudieron cargar los eventos");
      })
      .finally(() => setCargando(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, recargar]);

  async function toggleActivo(evento: Evento) {
    const token = getAdminToken();
    if (!token) {
      return;
    }
    if (evento.activo) {
      await desactivarEvento(token, evento.id);
      mostrarToast("Evento desactivado");
    } else {
      await activarEvento(token, evento.id);
      mostrarToast("Evento activado");
    }
    setRecargar((n) => n + 1);
  }

  function abrirNuevo() {
    setEditando(null);
    setMostrarForm(true);
  }

  function abrirEditar(evento: Evento) {
    setEditando(evento);
    setMostrarForm(true);
  }

  return (
    <div>
      <h2>Eventos</h2>

      <div className="admin-filtros">
        <button type="button" className="boton-nuevo" onClick={abrirNuevo}>
          + Nuevo evento
        </button>
      </div>

      <SlideOver
        open={mostrarForm}
        title={editando ? "Editar evento" : "Nuevo evento"}
        onClose={() => setMostrarForm(false)}
      >
        {mostrarForm && (
          <EventoForm
            key={editando?.id ?? "nuevo"}
            eventoEditando={editando}
            onGuardado={() => {
              setMostrarForm(false);
              setRecargar((n) => n + 1);
              mostrarToast(editando ? "Evento actualizado" : "Evento creado");
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
              <th>Fecha y hora</th>
              <th>Activo</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {cargando && (
              <tr>
                <td colSpan={3} className="admin-vacio">
                  Cargando...
                </td>
              </tr>
            )}
            {!cargando && eventos.length === 0 && (
              <tr>
                <td colSpan={3} className="admin-vacio">
                  Sin resultados
                </td>
              </tr>
            )}
            {!cargando &&
              eventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{new Date(evento.fechaHora).toLocaleString("es-GT")}</td>
                  <td>
                    <label
                      className="toggle-switch"
                      title={evento.activo ? "Desactivar" : "Activar"}
                    >
                      <input
                        type="checkbox"
                        checked={evento.activo}
                        onChange={() => toggleActivo(evento)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                  <td className="admin-acciones">
                    <button
                      type="button"
                      className="boton-icono"
                      onClick={() => abrirEditar(evento)}
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

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Toast mensaje={mensaje} />
    </div>
  );
}
