import "./Toast.css";

interface Props {
  mensaje: string | null;
}

export function Toast({ mensaje }: Props) {
  return (
    <div className={`toast ${mensaje ? "visible" : ""}`}>
      <span className="toast-check">✓</span>
      {mensaje}
    </div>
  );
}
