import { useEffect } from "react";
import type { ReactNode } from "react";
import "./SlideOver.css";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function SlideOver({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      <div
        className={`slide-overlay ${open ? "visible" : ""}`}
        onClick={onClose}
      />
      <aside className={`slide-panel ${open ? "visible" : ""}`}>
        <div className="slide-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="slide-cerrar"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="slide-contenido">{children}</div>
      </aside>
    </>
  );
}
