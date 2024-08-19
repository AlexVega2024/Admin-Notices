import { format } from 'date-fns'; // Importa date-fns

export const formatDateTime = (date: string) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm');
}

export const formatDateTimePicker = (date: string) => {
    return format(date, 'yyyy-MM-ddTHH:mm');
}