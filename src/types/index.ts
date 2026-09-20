export type TipoItem = "SERVICIO" | "PRODUCTO";

export interface Item {
  id: number;
  tipo: TipoItem;
  nombre: string;
  descripcion: string | null;
  precio: string;
  activo: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  numeroDocumento: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmacionItem {
  id: number;
  confirmacionId: number;
  itemId: number;
  precioAlMomento: string;
  item: Item;
}

export interface Evento {
  id: number;
  fechaHora: string;
  activo: boolean;
  createdAt: string;
}

export interface Confirmacion {
  id: number;
  clienteId: number;
  eventoId: number;
  descuentoServicios: number;
  descuentoProductos: number;
  createdAt: string;
  items: ConfirmacionItem[];
  cliente: Cliente;
  evento: Evento;
  accessToken: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
