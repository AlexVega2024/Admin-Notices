import { format, parseISO } from "date-fns";

export function formatDateTime(dateTime: string | undefined) {
  if (!dateTime) return "Fecha no disponible";

  try {
    const date = parseISO(dateTime);
    return format(date, "dd/MM/yyyy HH:mm"); // Cambia el formato según tus necesidades
  } catch (error) {
    console.error("Error formateando la fecha:", error);
    return "Fecha inválida";
  }
}
