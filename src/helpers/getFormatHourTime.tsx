export const getFormatHourTime = (timeUTC: string): string => {
    const hour = new Date(timeUTC).toLocaleTimeString('pe');
    return `${hour.slice(0, -5)}${hour.slice(-3)}`;
};
