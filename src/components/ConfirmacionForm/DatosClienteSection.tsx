import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ConfirmacionFormValues } from "../../schemas/confirmacion.schema";

interface Props {
  register: UseFormRegister<ConfirmacionFormValues>;
  errors: FieldErrors<ConfirmacionFormValues>;
}

export function DatosClienteSection({ register, errors }: Props) {
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
        <input type="datetime-local" {...register("fechaHoraEvento")} />
        {errors.fechaHoraEvento && (
          <span className="error">{errors.fechaHoraEvento.message}</span>
        )}
      </label>
    </section>
  );
}
