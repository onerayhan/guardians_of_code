import { useState, useEffect } from 'react';

const useMemoizedFetch = (url: string) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const cachedData = sessionStorage.getItem(url);
            if (cachedData) {
                setData(JSON.parse(cachedData));
            } else {
                const response = await fetch(url);
                const newData = await response.json();
                sessionStorage.setItem(url, JSON.stringify(newData));
                setData(newData);
            }
        };

        fetchData();
    }, [url]);

    return data;
};

export default useMemoizedFetch;