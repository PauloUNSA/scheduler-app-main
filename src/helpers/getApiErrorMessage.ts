import axios from 'axios';

interface ApiErrorBody {
    message?: string | string[];
}

export const getApiErrorMessage = (
    error: unknown,
    fallback = 'No se pudo completar la solicitud. Inténtalo nuevamente.',
) => {
    if (!axios.isAxiosError<ApiErrorBody>(error)) {
        return fallback;
    }

    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
        return message.join('\n');
    }

    return message || (error.request ? 'No se pudo conectar con el servidor.' : fallback);
};
