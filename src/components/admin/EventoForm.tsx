import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "../../api/client";
import { actualizarEvento, crearEvento } from "../../api/eventos";
import {
  eventoSchema,
  type EventoFormValues,
} from "../../schemas/evento.schema";
import type { Evento } from "../../types";
import { getAdminToken } from "../../utils/adminAuth";

interface Props {
  eventoEditando: Evento | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

function aInputLocal(fechaHoraIso: string) {
  const fecha = new Date(fechaHoraIso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(
    fecha.getDate(),
  )}T${pad(fecha.getHours())}:${pad(fecha.getMinutes())}`;
}

export function EventoForm({ eventoEditando, onGuardado, onCancelar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<EventoFormValues>({
    resolver: zodResolver(eventoSchema),
    mode: "onChange",
    defaultValues: eventoEditando
      ? { fechaHora: aInputLocal(eventoEditando.fechaHora) }
      : undefined,
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(valores: EventoFormValues) {
    const token = getAdminToken();
    if (!token) {
      return;
    }

    setEnviando(true);
    setError(null);

    try {
      const iso = new Date(valores.fechaHora).toISOString();
      if (eventoEditando) {
        await actualizarEvento(token, eventoEditando.id, iso);
      } else {
        await crearEvento(token, iso);
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
      <label className="campo">
        <span>
          Fecha y hora <span className="requerido">*</span>
        </span>
        <input type="datetime-local" {...register("fechaHora")} />
        {errors.fechaHora && (
          <span className="error">{errors.fechaHora.message}</span>
        )}
      </label>

      {error && <p className="error-general">{error}</p>}

      <div className="item-form-acciones">
        <button type="button" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" disabled={enviando || !isValid}>
          {enviando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
