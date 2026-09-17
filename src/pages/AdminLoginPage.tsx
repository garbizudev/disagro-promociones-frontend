import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { ApiError } from "../api/client";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { setAdminToken } from "../utils/adminAuth";
import "./AdminLoginPage.css";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  async function onSubmit(valores: LoginFormValues) {
    setEnviando(true);
    setErrorGeneral(null);

    try {
      const { accessToken } = await login(valores);
      setAdminToken(accessToken);
      navigate("/admin");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorGeneral(
          error.status === 401
            ? "Usuario o contrasena incorrectos"
            : error.message,
        );
      } else {
        setErrorGeneral("Ocurrio un error inesperado, intenta de nuevo");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Disagro</h1>
        <p className="subtitulo">Panel administrativo</p>

        <label className="campo">
          <span>Usuario</span>
          <input type="text" placeholder="admin" {...register("username")} />
          {errors.username && (
            <span className="error">{errors.username.message}</span>
          )}
        </label>

        <label className="campo">
          <span>Contrasena</span>
          <input type="password" {...register("password")} />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </label>

        {errorGeneral && <p className="error-general">{errorGeneral}</p>}

        <button type="submit" className="boton-login" disabled={enviando}>
          {enviando ? "Ingresando..." : "Iniciar sesion"}
        </button>
      </form>
    </div>
  );
}
