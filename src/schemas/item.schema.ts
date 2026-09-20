import { z } from "zod";

export const itemSchema = z.object({
  tipo: z.enum(["SERVICIO", "PRODUCTO"]),
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  precio: z
    .string()
    .min(1, "El precio es requerido")
    .refine((valor) => Number(valor) > 0, "El precio debe ser mayor a 0"),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
