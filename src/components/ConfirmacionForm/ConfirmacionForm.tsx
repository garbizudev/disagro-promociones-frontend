import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "../../api/client";
import { crearConfirmacion } from "../../api/confirmaciones";
import { buscarEventosDisponibles } from "../../api/eventos";
import {
  confirmacionSchema,
  type ConfirmacionFormValues,
} from "../../schemas/confirmacion.schema";
import type { Confirmacion, Evento, Item } from "../../types";
import { DatosClienteSection } from "./DatosClienteSection";
import { ItemsSection } from "./ItemsSection";
import "./ConfirmacionForm.css";

export function ConfirmacionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ConfirmacionFormValues>({
    resolver: zodResolver(confirmacionSchema),
    mode: "onChange",
  });

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Confirmacion | null>(null);

  useEffect(() => {
    buscarEventosDisponibles()
      .then(setEventos)
      .catch(() => setEventos([]));
  }, []);

  function toggleItem(item: Item) {
    setSelectedItems((actuales) =>
      actuales.some((seleccionado) => seleccionado.id === item.id)
        ? actuales.filter((seleccionado) => seleccionado.id !== item.id)
        : [...actuales, item],
    );
  }

  async function onSubmit(valores: ConfirmacionFormValues) {
    setEnviando(true);
    setErrorGeneral(null);

    try {
      const confirmacion = await crearConfirmacion({
        cliente: {
          nombre: valores.nombre,
          apellidos: valores.apellidos,
          email: valores.email,
          numeroDocumento: valores.numeroDocumento,
        },
        eventoId: Number(valores.eventoId),
        itemIds: selectedItems.map((item) => item.id),
      });

      localStorage.setItem("disagro_token", confirmacion.accessToken);
      setResultado(confirmacion);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorGeneral(error.message);
      } else {
        setErrorGeneral("Ocurrió un error inesperado, intenta de nuevo");
      }
    } finally {
      setEnviando(false);
    }
  }

  if (resultado) {
    return (
      <div className="disagro-app">
        <header className="disagro-header">
          <div>
            <h1>Disagro</h1>
            <p>Feria de Promociones - 2026</p>
          </div>
        </header>
        <div className="confirmacion-exito">
          <h2>Gracias por confirmar tu asistencia, {resultado.cliente.nombre}</h2>
          <p>
            Te esperamos el{" "}
            {new Date(resultado.evento.fechaHora).toLocaleString("es-GT", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
          <div className="descuentos">
            <div className="descuento-caja">
              <p>Descuento obtenido en Servicios</p>
              <strong>{resultado.descuentoServicios}%</strong>
            </div>
            <div className="descuento-caja">
              <p>Descuento obtenido en Productos</p>
              <strong>{resultado.descuentoProductos}%</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="disagro-app">
      <header className="disagro-header">
        <div>
          <h1>Disagro</h1>
          <p>Feria de Promociones - 2026</p>
        </div>
      </header>

      <form className="disagro-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="disagro-grid">
          <DatosClienteSection
            register={register}
            errors={errors}
            eventos={eventos}
          />
          <ItemsSection selectedItems={selectedItems} onToggleItem={toggleItem} />
        </div>

        {errorGeneral && <p className="error-general">{errorGeneral}</p>}

        <button
          type="submit"
          className="boton-confirmar"
          disabled={enviando || !isValid || selectedItems.length === 0}
        >
          {enviando ? "Enviando..." : "CONFIRMAR ASISTENCIA →"}
        </button>
      </form>

      <footer className="disagro-footer">Atención al cliente: 2223-2425</footer>
    </div>
  );
}
