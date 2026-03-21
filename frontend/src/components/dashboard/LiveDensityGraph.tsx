import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Clock } from 'lucide-react';

interface LiveDensityGraphProps {
    currentCount: number;
    isConnected: boolean;
}

const LiveDensityGraph = ({ currentCount, isConnected }: LiveDensityGraphProps) => {
    const [data, setData] = useState<{ time: number; density: number }[]>(() => {
        return Array.from({ length: 30 }, (_, i) => ({
            time: i,
            density: 0
        }));
    });
    const timeCounter = useRef(29);
    const latestCountRef = useRef(currentCount);

    useEffect(() => {
        latestCountRef.current = currentCount;
    }, [currentCount]);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(currentData => {
                const newData = [...currentData.slice(1)];
                timeCounter.current += 1;
                newData.push({ time: timeCounter.current, density: latestCountRef.current });
                return newData;
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const avgDensity = Math.round(data.reduce((acc, d) => acc + d.density, 0) / data.length);
    const maxDensity = Math.max(...data.map(d => d.density));

    return (
        <div className="card h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-accent" />
                    <div>
                        <h3 className="font-semibold text-foreground text-sm">Crowd Density</h3>
                        <p className="text-xs text-foreground-muted">Real-time monitoring</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {/* Stats */}
                    <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{avgDensity}</p>
                        <p className="text-xs text-foreground-muted">Average</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-right">
                        <p className="text-lg font-semibold text-accent">{maxDensity}</p>
                        <p className="text-xs text-foreground-muted">Peak</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${isConnected ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                        }`}>
                        <Clock className="w-3 h-3" />
                        {isConnected ? 'Live' : 'Offline'}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-0 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="densityFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1f1f28" strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis
                            stroke="#52525b"
                            tick={{ fill: '#71717a', fontSize: 11 }}
                            domain={[0, 'auto']}
                            axisLine={false}
                            tickLine={false}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0c0c0f',
                                border: '1px solid #1f1f28',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                            }}
                            itemStyle={{ color: '#06b6d4', fontSize: '13px', fontWeight: 500 }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="density"
                            stroke="#06b6d4"
                            strokeWidth={2}
                            fill="url(#densityFill)"
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default LiveDensityGraph;
