import { apiFetch, apiFetchAuth } from "./client";
import type { Evento, PaginatedResult } from "../types";

export function buscarEventosDisponibles() {
  return apiFetch<Evento[]>("/eventos");
}

export interface BuscarEventosAdminParams {
  page?: number;
  pageSize?: number;
}

export function buscarEventosAdmin(
  token: string,
  params: BuscarEventosAdminParams,
) {
  const query = new URLSearchParams();
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.pageSize) {
    query.set("pageSize", String(params.pageSize));
  }
  return apiFetchAuth<PaginatedResult<Evento>>(
    `/eventos/admin?${query.toString()}`,
    token,
  );
}

export function crearEvento(token: string, fechaHora: string) {
  return apiFetchAuth<Evento>("/eventos", token, {
    method: "POST",
    body: JSON.stringify({ fechaHora }),
  });
}

export function actualizarEvento(
  token: string,
  id: number,
  fechaHora: string,
) {
  return apiFetchAuth<Evento>(`/eventos/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify({ fechaHora }),
  });
}

export function activarEvento(token: string, id: number) {
  return apiFetchAuth<Evento>(`/eventos/${id}/activar`, token, {
    method: "PATCH",
  });
}

export function desactivarEvento(token: string, id: number) {
  return apiFetchAuth<Evento>(`/eventos/${id}/desactivar`, token, {
    method: "PATCH",
  });
}
