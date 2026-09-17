import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "../../api/client";
import { crearConfirmacion } from "../../api/confirmaciones";
import {
  confirmacionSchema,
  type ConfirmacionFormValues,
} from "../../schemas/confirmacion.schema";
import type { Confirmacion, Item } from "../../types";
import { DatosClienteSection } from "./DatosClienteSection";
import { ItemsSection } from "./ItemsSection";
import "./ConfirmacionForm.css";

export function ConfirmacionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmacionFormValues>({
    resolver: zodResolver(confirmacionSchema),
  });

  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Confirmacion | null>(null);

  function toggleItem(item: Item) {
    setSelectedItems((actuales) =>
      actuales.some((seleccionado) => seleccionado.id === item.id)
        ? actuales.filter((seleccionado) => seleccionado.id !== item.id)
        : [...actuales, item],
    );
  }

  async function onSubmit(valores: ConfirmacionFormValues) {
    if (selectedItems.length === 0) {
      setErrorGeneral("Selecciona al menos un servicio o producto");
      return;
    }

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
        fechaHoraEvento: new Date(valores.fechaHoraEvento).toISOString(),
        itemIds: selectedItems.map((item) => item.id),
      });

      localStorage.setItem("disagro_token", confirmacion.accessToken);
      setResultado(confirmacion);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorGeneral(error.message);
      } else {
        setErrorGeneral("Ocurrio un error inesperado, intenta de nuevo");
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
          <DatosClienteSection register={register} errors={errors} />
          <ItemsSection selectedItems={selectedItems} onToggleItem={toggleItem} />
        </div>

        {errorGeneral && <p className="error-general">{errorGeneral}</p>}

        <button type="submit" className="boton-confirmar" disabled={enviando}>
          {enviando ? "Enviando..." : "CONFIRMAR ASISTENCIA →"}
        </button>
      </form>

      <footer className="disagro-footer">Atencion al cliente: 2223-2425</footer>
    </div>
  );
}
