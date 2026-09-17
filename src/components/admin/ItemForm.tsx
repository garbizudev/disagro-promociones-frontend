import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "../../api/client";
import { actualizarItem, crearItem } from "../../api/items";
import { itemSchema, type ItemFormValues } from "../../schemas/item.schema";
import type { Item } from "../../types";
import { getAdminToken } from "../../utils/adminAuth";

interface Props {
  itemEditando: Item | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

export function ItemForm({ itemEditando, onGuardado, onCancelar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: itemEditando
      ? {
          tipo: itemEditando.tipo,
          nombre: itemEditando.nombre,
          descripcion: itemEditando.descripcion ?? "",
          precio: Number(itemEditando.precio),
        }
      : { tipo: "PRODUCTO" },
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(valores: ItemFormValues) {
    const token = getAdminToken();
    if (!token) {
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      if (itemEditando) {
        await actualizarItem(token, itemEditando.id, {
          nombre: valores.nombre,
          descripcion: valores.descripcion,
          precio: valores.precio,
        });
      } else {
        await crearItem(token, valores);
      }
      onGuardado();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error inesperado");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="item-form" onSubmit={handleSubmit(onSubmit)}>
      <h3>{itemEditando ? "Editar item" : "Nuevo item"}</h3>

      <label className="campo">
        <span>Tipo</span>
        <select {...register("tipo")} disabled={!!itemEditando}>
          <option value="SERVICIO">Servicio</option>
          <option value="PRODUCTO">Producto</option>
        </select>
      </label>

      <label className="campo">
        <span>Nombre</span>
        <input type="text" {...register("nombre")} />
        {errors.nombre && (
          <span className="error">{errors.nombre.message}</span>
        )}
      </label>

      <label className="campo">
        <span>Descripcion</span>
        <input type="text" {...register("descripcion")} />
      </label>

      <label className="campo">
        <span>Precio</span>
        <input type="number" step="0.01" {...register("precio")} />
        {errors.precio && (
          <span className="error">{errors.precio.message}</span>
        )}
      </label>

      {error && <p className="error-general">{error}</p>}

      <div className="item-form-acciones">
        <button type="button" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" disabled={enviando}>
          {enviando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
