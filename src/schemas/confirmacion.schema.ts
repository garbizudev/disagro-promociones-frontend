import { z } from "zod";

export const confirmacionSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellidos: z.string().min(1, "Los apellidos son requeridos"),
  email: z.string().min(1, "El correo es requerido").email("Correo inválido"),
  numeroDocumento: z.string().min(1, "El número de documento es requerido"),
  eventoId: z
    .string()
    .min(1, "Selecciona una fecha del evento")
    .refine((valor) => Number(valor) > 0, "Selecciona una fecha del evento"),
});

export type ConfirmacionFormValues = z.infer<typeof confirmacionSchema>;
