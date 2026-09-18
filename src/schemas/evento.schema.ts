import { z } from "zod";

export const eventoSchema = z.object({
  fechaHora: z.string().min(1, "La fecha y hora es requerida"),
});

export type EventoFormValues = z.infer<typeof eventoSchema>;
