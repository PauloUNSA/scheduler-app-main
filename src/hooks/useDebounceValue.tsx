import { useEffect, useState } from 'react';

interface Props {
    input: string,
    time: number,
}

export const useDebounceValue = ({input, time}: Props) => {

    const [debouncedValue, setDebouncedValue] = useState(input);

    useEffect(() => {

        const timeout = setTimeout(() => {
            setDebouncedValue(input);
        }, time);

        return () => {
            clearTimeout(timeout);
        };
    }, [input]);

    return {
        debouncedValue,
    };
};
