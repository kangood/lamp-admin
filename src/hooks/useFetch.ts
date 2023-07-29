import { useState, useEffect, useRef } from 'react';

import config from '../../public/config.json';

export interface ResultType {
    id: number;
    key: string;
    name: string;
    value: string;
    describe: string;
    state: boolean;
    readonly: boolean;
    deletedAt: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
}

// This custom hook centralizes and streamlines handling of HTTP calls
export default function useFetch(url: string, init: RequestInit) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevInit = useRef({});
    const prevUrl = useRef('');

    useEffect(() => {
        // Only refetch if url or init params change.
        if (prevUrl.current === url && prevInit.current === init) return;
        prevUrl.current = url;
        prevInit.current = init;
        fetch(config.api.baseUrl + url, init)
            .then((response) => {
                if (response.ok) return response.json();
                return null;
            })
            .then(() => setData(data))
            .catch((err) => {
                console.error(err);
                setError(err);
            })
            .finally(() => setLoading(false));
    }, [init, url]);

    return { data, loading, error };
}
