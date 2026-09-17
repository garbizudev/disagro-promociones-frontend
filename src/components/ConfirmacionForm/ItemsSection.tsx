import { useEffect, useState } from "react";
import { buscarItems } from "../../api/items";
import type { Item } from "../../types";
import { calcularDescuentosPreview } from "../../utils/descuentos";

interface Props {
  selectedItems: Item[];
  onToggleItem: (item: Item) => void;
}

export function ItemsSection({ selectedItems, onToggleItem }: Props) {
  const [search, setSearch] = useState("");
  const [resultados, setResultados] = useState<Item[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCargando(true);
      buscarItems(search)
        .then(setResultados)
        .catch(() => setResultados([]))
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const { descuentoServicios, descuentoProductos } =
    calcularDescuentosPreview(selectedItems);
  const seleccionadosIds = new Set(selectedItems.map((item) => item.id));

  return (
    <section className="seccion seccion-items">
      <h2>
        <span className="paso-numero">2</span> Seleccione Servicios y
        Productos de su interes
      </h2>

      <input
        type="search"
        placeholder="Buscar Servicios y Productos"
        value={search}
        onChange={(evento) => setSearch(evento.target.value)}
        className="buscador"
      />

      <ul className="resultados-busqueda">
        {cargando && <li className="resultado-vacio">Buscando...</li>}
        {!cargando && resultados.length === 0 && (
          <li className="resultado-vacio">Sin resultados</li>
        )}
        {!cargando &&
          resultados.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={seleccionadosIds.has(item.id)}
                  onChange={() => onToggleItem(item)}
                />
                <span className="nombre">{item.nombre}</span>
                <span className="precio">
                  Q{Number(item.precio).toFixed(2)}
                </span>
              </label>
            </li>
          ))}
      </ul>

      <div className="seleccionados">
        <p className="seleccionados-titulo">
          Servicios y/o Productos seleccionados:
        </p>

        {selectedItems.length === 0 && (
          <p className="seleccionados-vacio">Aun no has seleccionado nada</p>
        )}

        <ul>
          {selectedItems.map((item) => (
            <li key={item.id} className="seleccionado-fila">
              <span className="check">✓</span>
              <span className="nombre">{item.nombre}</span>
              <span className="precio">
                Q{Number(item.precio).toFixed(2)}
              </span>
              <button
                type="button"
                className="quitar"
                onClick={() => onToggleItem(item)}
                aria-label={`Quitar ${item.nombre}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="descuentos">
        <div className="descuento-caja">
          <p>Descuento obtenido en Servicios</p>
          <strong>{descuentoServicios}%</strong>
        </div>
        <div className="descuento-caja">
          <p>Descuento obtenido en Productos</p>
          <strong>{descuentoProductos}%</strong>
        </div>
      </div>
    </section>
  );
}
