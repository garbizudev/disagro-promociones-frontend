import { apiFetch, apiFetchAuth } from "./client";
import type { Confirmacion } from "../types";

export interface CrearConfirmacionPayload {
  cliente: {
    nombre: string;
    apellidos: string;
    email: string;
    numeroDocumento: string;
  };
  fechaHoraEvento: string;
  itemIds: number[];
}

export function crearConfirmacion(payload: CrearConfirmacionPayload) {
  return apiFetch<Confirmacion>("/confirmaciones", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface BuscarConfirmacionesParams {
  search?: string;
  fecha?: string;
}

export function buscarConfirmaciones(
  token: string,
  params: BuscarConfirmacionesParams,
) {
  const query = new URLSearchParams();
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.fecha) {
    query.set("fecha", params.fecha);
  }
  return apiFetchAuth<Confirmacion[]>(
    `/confirmaciones?${query.toString()}`,
    token,
  );
}
