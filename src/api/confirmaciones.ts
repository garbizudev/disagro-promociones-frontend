import { apiFetch } from "./client";
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
