import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ConfirmacionFormValues } from "../../schemas/confirmacion.schema";
import type { Evento } from "../../types";

interface Props {
  register: UseFormRegister<ConfirmacionFormValues>;
  errors: FieldErrors<ConfirmacionFormValues>;
  eventos: Evento[];
}

export function DatosClienteSection({ register, errors, eventos }: Props) {
  return (
    <section className="seccion seccion-datos">
      <h2>
        <span className="paso-numero">1</span> Ingrese su información
      </h2>

      <label className="campo">
        <span>
          Nombre <span className="requerido">*</span>
        </span>
        <input
          type="text"
          placeholder="Introduzca su nombre"
          {...register("nombre")}
        />
        {errors.nombre && (
          <span className="error">{errors.nombre.message}</span>
        )}
      </label>

      <label className="campo">
        <span>
          Apellidos <span className="requerido">*</span>
        </span>
        <input
          type="text"
          placeholder="Introduzca sus apellidos"
          {...register("apellidos")}
        />
        {errors.apellidos && (
          <span className="error">{errors.apellidos.message}</span>
        )}
      </label>

      <label className="campo">
        <span>
          Email <span className="requerido">*</span>
        </span>
        <input
          type="email"
          placeholder="Introduzca su email"
          {...register("email")}
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </label>

      <label className="campo">
        <span>
          Número de documento <span className="requerido">*</span>
        </span>
        <input
          type="text"
          placeholder="Introduzca su DPI o documento"
          {...register("numeroDocumento")}
        />
        {errors.numeroDocumento && (
          <span className="error">{errors.numeroDocumento.message}</span>
        )}
      </label>

      <label className="campo">
        <span>
          Fecha y Hora <span className="requerido">*</span>
        </span>
        <select {...register("eventoId")} defaultValue="">
          <option value="" disabled>
            Seleccione fecha y hora en que asistirá
          </option>
          {eventos.map((evento) => (
            <option key={evento.id} value={evento.id}>
              {new Date(evento.fechaHora).toLocaleString("es-GT", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </option>
          ))}
        </select>
        {errors.eventoId && (
          <span className="error">{errors.eventoId.message}</span>
        )}
      </label>
    </section>
  );
}
