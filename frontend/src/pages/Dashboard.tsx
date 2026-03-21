import { motion } from 'framer-motion';
import VideoPlayer from '../components/dashboard/VideoPlayer';
import ZoneStatus from '../components/dashboard/ZoneStatus';
import LiveDensityGraph from '../components/dashboard/LiveDensityGraph';
import { useCrowdData } from '../hooks/useCrowdData';
import { Users, TrendingUp, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight, Sparkles, RefreshCw } from 'lucide-react';

const Dashboard = () => {
    const { data, isConnected, sendMessage } = useCrowdData('ws://localhost:8000/ws');

    const stats = [
        {
            label: 'Total Crowd',
            value: data?.count ? Math.round(data.count).toLocaleString() : '—',
            icon: Users,
            change: '+12%',
            trend: 'up',
            color: 'accent'
        },
        {
            label: 'System Status',
            value: data?.status || 'Standby',
            icon: Activity,
            sublabel: 'Last updated 2s ago',
            color: data?.status === 'CRITICAL' ? 'danger' : data?.status === 'WARNING' ? 'warning' : 'success'
        },
        {
            label: 'Capacity Used',
            value: data?.count ? `${Math.round((data.count / 1000) * 100)}%` : '—',
            icon: TrendingUp,
            change: '+5%',
            trend: 'up',
            color: 'accent'
        },
        {
            label: 'Active Alerts',
            value: data?.status === 'CRITICAL' || data?.status === 'WARNING' ? '1' : '0',
            icon: AlertTriangle,
            sublabel: data?.status === 'CRITICAL' ? 'Immediate action' : 'No issues',
            color: data?.status === 'CRITICAL' ? 'danger' : 'accent'
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
                    <p className="text-foreground-muted text-sm mt-0.5">Real-time crowd monitoring and analytics</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-ghost btn-sm">
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="btn-primary btn-sm">
                        <Sparkles className="w-4 h-4" />
                        Generate Report
                    </button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {stats.map((stat) => (
                    <motion.div
                        key={stat.label}
                        variants={item}
                        className="stat-card group"
                    >
                        {/* Gradient Glow */}
                        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.color === 'danger' ? 'bg-danger/20' :
                            stat.color === 'warning' ? 'bg-warning/20' :
                                stat.color === 'success' ? 'bg-success/20' : 'bg-accent/20'
                            }`} />

                        <div className="relative flex items-start justify-between mb-3">
                            <div className={`p-2 rounded-lg ${stat.color === 'danger' ? 'bg-danger/10' :
                                stat.color === 'warning' ? 'bg-warning/10' :
                                    stat.color === 'success' ? 'bg-success/10' : 'bg-accent/10'
                                }`}>
                                <stat.icon className={`w-4 h-4 ${stat.color === 'danger' ? 'text-danger' :
                                    stat.color === 'warning' ? 'text-warning' :
                                        stat.color === 'success' ? 'text-success' : 'text-accent'
                                    }`} />
                            </div>
                            {stat.change && (
                                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.trend === 'up' ? 'text-success' : 'text-danger'
                                    }`}>
                                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.change}
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <p className={`stat-value ${stat.color === 'danger' ? 'text-danger' :
                                stat.color === 'warning' ? 'text-warning' :
                                    stat.color === 'success' ? 'text-success' : 'text-foreground'
                                }`}>
                                {stat.value}
                            </p>
                            <p className="stat-label mt-1">{stat.label}</p>
                            {stat.sublabel && (
                                <p className="text-xs text-foreground-subtle mt-1">{stat.sublabel}</p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                <motion.div variants={item} className="lg:col-span-2 h-[420px]">
                    <VideoPlayer
                        image={data?.image || null}
                        isConnected={isConnected}
                        isSimulation={data?.is_simulation}
                        isHeatmapOn={data?.heatmap_on}
                        onToggleHeatmap={(val) => sendMessage({ action: "toggle_heatmap", value: val })}
                    />
                </motion.div>
                <motion.div variants={item} className="h-[420px]">
                    <ZoneStatus zones={data?.zones} />
                </motion.div>
            </motion.div>

            {/* Graph Section */}
            <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="h-[280px]"
            >
                <LiveDensityGraph
                    currentCount={data?.count || 0}
                    isConnected={isConnected}
                />
            </motion.div>
        </div>
    );
};

export default Dashboard;
