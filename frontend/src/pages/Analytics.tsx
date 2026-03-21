import { motion } from 'framer-motion';
import { Filter, Download, TrendingUp, TrendingDown, Calendar, Clock, AlertCircle } from 'lucide-react';

const Analytics = () => {
    const stats = [
        { label: 'Peak Density', value: '847', subvalue: 'people', change: '+12%', trend: 'up' },
        { label: 'Avg Flow Rate', value: '45', subvalue: '/min', change: '-5%', trend: 'down' },
        { label: 'Total Incidents', value: '3', subvalue: 'today', change: '—', trend: 'neutral' },
    ];

    const logs = [
        { time: '14:20:05', zone: 'Food Court', zoneId: 'B', density: 92, duration: '00:04:12', resolved: true },
        { time: '12:45:33', zone: 'Main Entrance', zoneId: 'A', density: 78, duration: '00:12:30', resolved: true },
        { time: '10:15:22', zone: 'Stage Front', zoneId: 'C', density: 95, duration: '00:02:05', resolved: false },
        { time: '09:30:11', zone: 'Exit Corridor', zoneId: 'D', density: 88, duration: '00:08:45', resolved: true },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.06 } }
    };

    const item = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                variants={item} initial="hidden" animate="show"
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">Analytics</h1>
                    <p className="text-foreground-muted text-sm mt-0.5">Historical data and incident reports</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary btn-sm">
                        <Calendar className="w-4 h-4" />
                        Last 24h
                    </button>
                    <button className="btn-secondary btn-sm">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="btn-primary btn-sm">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <motion.div key={stat.label} variants={item} className="stat-card">
                        <div className="flex items-center justify-between mb-2">
                            <span className="stat-label">{stat.label}</span>
                            {stat.trend !== 'neutral' && (
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === 'up' ? 'text-success' : 'text-danger'
                                    }`}>
                                    {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="stat-value">{stat.value}</span>
                            <span className="text-sm text-foreground-muted">{stat.subvalue}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Incidents Table */}
            <motion.div variants={item} initial="hidden" animate="show" className="card overflow-hidden">
                <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-accent" />
                        <h3 className="font-semibold text-foreground text-sm">Recent Surge Events</h3>
                    </div>
                    <span className="text-xs text-foreground-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Last 24 hours
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border/50">
                                <th className="table-header text-left">Time</th>
                                <th className="table-header text-left">Zone</th>
                                <th className="table-header text-left">Peak Density</th>
                                <th className="table-header text-left">Duration</th>
                                <th className="table-header text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((row, i) => (
                                <tr key={i} className="table-row">
                                    <td className="table-cell font-mono text-foreground-secondary">{row.time}</td>
                                    <td className="table-cell">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${row.density > 90 ? 'bg-danger/10 text-danger' :
                                                row.density > 75 ? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'
                                                }`}>
                                                {row.zoneId}
                                            </div>
                                            <span className="text-foreground">{row.zone}</span>
                                        </div>
                                    </td>
                                    <td className="table-cell">
                                        <span className={`badge ${row.density > 90 ? 'badge-danger' :
                                            row.density > 75 ? 'badge-warning' : 'badge-success'
                                            }`}>
                                            {row.density}%
                                        </span>
                                    </td>
                                    <td className="table-cell font-mono text-foreground-secondary">{row.duration}</td>
                                    <td className="table-cell text-right">
                                        <span className={`badge ${row.resolved ? 'badge-success' : 'badge-warning'}`}>
                                            {row.resolved ? 'Resolved' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
