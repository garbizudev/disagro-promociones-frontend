import { apiFetch, apiFetchAuth } from "./client";
import type { Item, PaginatedResult, TipoItem } from "../types";

export function buscarItems(search: string) {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  return apiFetch<Item[]>(`/items?${params.toString()}`);
}

export interface BuscarItemsAdminParams {
  search?: string;
  tipo?: TipoItem;
  page?: number;
  pageSize?: number;
}

export function buscarItemsAdmin(
  token: string,
  params: BuscarItemsAdminParams,
) {
  const query = new URLSearchParams();
  if (params.search) {
    query.set("search", params.search);
  }
  if (params.tipo) {
    query.set("tipo", params.tipo);
  }
  if (params.page) {
    query.set("page", String(params.page));
  }
  if (params.pageSize) {
    query.set("pageSize", String(params.pageSize));
  }
  return apiFetchAuth<PaginatedResult<Item>>(
    `/items/admin?${query.toString()}`,
    token,
  );
}

export interface CrearItemPayload {
  tipo: TipoItem;
  nombre: string;
  descripcion?: string;
  precio: number;
}

export function crearItem(token: string, payload: CrearItemPayload) {
  return apiFetchAuth<Item>("/items", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface ActualizarItemPayload {
  nombre?: string;
  descripcion?: string;
  precio?: number;
}

export function actualizarItem(
  token: string,
  id: number,
  payload: ActualizarItemPayload,
) {
  return apiFetchAuth<Item>(`/items/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function activarItem(token: string, id: number) {
  return apiFetchAuth<Item>(`/items/${id}/activar`, token, {
    method: "PATCH",
  });
}

export function desactivarItem(token: string, id: number) {
  return apiFetchAuth<Item>(`/items/${id}/desactivar`, token, {
    method: "PATCH",
  });
}
