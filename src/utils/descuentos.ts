import type { Item } from "../types";

export function calcularDescuentosPreview(items: Item[]) {
  const servicios = items.filter((item) => item.tipo === "SERVICIO");
  const productos = items.filter((item) => item.tipo === "PRODUCTO");

  let descuentoServicios = 0;
  if (servicios.length >= 2) {
    const sumaServicios = servicios.reduce(
      (total, servicio) => total + Number(servicio.precio),
      0,
    );
    descuentoServicios = sumaServicios > 1500 ? 5 : 3;
  }

  let descuentoProductos = 0;
  if (productos.length >= 5) {
    descuentoProductos = 5;
  } else if (productos.length >= 3) {
    descuentoProductos = 3;
  }

  return { descuentoServicios, descuentoProductos };
}
