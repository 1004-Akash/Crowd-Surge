import { useState, useEffect, useCallback, useRef } from 'react';

export interface ZoneData {
    [key: string]: number;
}

export interface CrowdData {
    timestamp: string;
    count: number;
    status: 'SAFE' | 'WARNING' | 'CRITICAL';
    zones: ZoneData;
    image: string | null;
    is_simulation: boolean;
    heatmap_on: boolean;
}

export const useCrowdData = (url: string, token: string | null) => {
    const [data, setData] = useState<CrowdData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    const sendMessage = useCallback((msg: object) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        } else {
            console.warn("WebSocket not connected, cannot send message");
        }
    }, []);

    useEffect(() => {
        if (!token) {
            setIsConnected(false);
            return;
        }

        let ws: WebSocket | null = null;
        let reconnectTimeout: number | undefined;

        const connect = () => {
            try {
                // Pass token as query parameter
                const fullUrl = `${url}?token=${token}`;
                ws = new WebSocket(fullUrl);

                ws.onopen = () => {
                    console.log('Connected to CrowdSafe Backend');
                    setIsConnected(true);
                    setError(null);
                };

                ws.onmessage = (event) => {
                    try {
                        const parsedData = JSON.parse(event.data);
                        if (parsedData.error) {
                            console.error('Backend Error:', parsedData.message || parsedData.error);
                            return;
                        }
                        setData({
                            timestamp: parsedData.timestamp,
                            count: parsedData.count,
                            status: parsedData.status,
                            zones: parsedData.zones,
                            image: parsedData.image,
                            is_simulation: parsedData.is_simulation,
                            heatmap_on: parsedData.heatmap_on
                        });
                    } catch (e) {
                        console.error('Error parsing WebSocket message:', e);
                    }
                };

                ws.onclose = (event) => {
                    console.log('Disconnected from Backend', event.code);
                    setIsConnected(false);
                    
                    // If closed due to policy violation (invalid token), don't reconnect
                    if (event.code !== 1008) {
                        reconnectTimeout = setTimeout(connect, 3000);
                    } else {
                        setError('Session expired or unauthorized');
                    }
                };

                ws.onerror = (err) => {
                    console.error('WebSocket Error:', err);
                    setError('Connection Error');
                    if (ws) ws.close();
                };

                wsRef.current = ws;

            } catch (e) {
                console.error('Connection setup error:', e);
                setError('Failed to setup connection');
                reconnectTimeout = setTimeout(connect, 3000);
            }
        };

        connect();

        return () => {
            if (ws) {
                ws.onclose = null;
                ws.close();
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
        };
    }, [url, token]);

    return { data, isConnected, error, sendMessage };
};
