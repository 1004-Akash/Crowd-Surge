import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VideoPlayer from '../components/dashboard/VideoPlayer';
import ZoneStatus from '../components/dashboard/ZoneStatus';
import MonitorInbox from '../components/dashboard/MonitorInbox';
import LiveDensityGraph from '../components/dashboard/LiveDensityGraph';
import { useCrowdData } from '../hooks/useCrowdData';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../context/AuthContext';
import { Users, TrendingUp, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight, Shield, Eye, ShieldAlert, FileText, Loader2, Siren, Zap, Clock } from 'lucide-react';

const Dashboard = () => {
    const { token, user } = useAuth();
    const { data, isConnected, sendMessage, error } = useCrowdData('ws://localhost:8000/ws', token);
    const { notifications } = useNotifications(token);
    const [isEscalating, setIsEscalating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Get the most recent critical/warning notification for the banner
    const latestAlert = notifications.length > 0 ? notifications[0] : null;

    const handleEscalate = async () => {
      if (!window.confirm("Are you sure you want to escalate this incident to all administrators?")) return;
      
      setIsEscalating(true);
      try {
        const response = await fetch('http://localhost:8000/dashboard/escalate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          alert("Incident successfully escalated to administrators.");
        }
      } catch (err) {
        console.error("Escalation failed", err);
      } finally {
        setIsEscalating(false);
      }
    };

    const handleGenerateReport = async () => {
      setIsGenerating(true);
      try {
        const response = await fetch('http://localhost:8000/dashboard/report', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `CrowdSurge_Report_${new Date().toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        }
      } catch (err) {
        console.error("Report generation failed", err);
      } finally {
        setIsGenerating(false);
      }
    };

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
            sublabel: isConnected ? 'Live Connection' : 'Reconnecting...',
            color: !isConnected ? 'warning' : data?.status === 'CRITICAL' ? 'danger' : data?.status === 'WARNING' ? 'warning' : 'success'
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
        <div className="space-y-6 relative">
            {/* Real-time Intervention Banner - High Priority Display */}
            <AnimatePresence mode="wait">
              {latestAlert && (latestAlert.status === 'CRITICAL' || latestAlert.status === 'WARNING') && (
                <motion.div
                  key={latestAlert.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="mb-6"
                >
                  <div className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-6 glass bg-opacity-95 overflow-hidden relative group ${
                    latestAlert.status === 'CRITICAL' ? 'border-danger/40 bg-danger/10 shadow-glow-danger' : 'border-warning/40 bg-warning/10 shadow-glow-warning'
                  }`}>
                    {/* Background Siren Effect */}
                    {latestAlert.status === 'CRITICAL' && (
                        <div className="absolute inset-0 bg-danger/5 animate-pulse pointer-events-none" />
                    )}

                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`p-4 rounded-full ${latestAlert.status === 'CRITICAL' ? 'bg-danger text-white' : 'bg-warning text-black'}`}>
                        {latestAlert.status === 'CRITICAL' ? <Siren className="w-7 h-7 animate-bounce-slow" /> : <ShieldAlert className="w-7 h-7" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
                                latestAlert.status === 'CRITICAL' ? 'bg-danger text-white' : 'bg-warning text-black'
                           }`}>{latestAlert.status} PROTOCOL ACTIVE</span>
                           <span className="text-[10px] text-foreground-muted font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> {latestAlert.timestamp}</span>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight leading-none text-foreground">
                          {latestAlert.status === 'CRITICAL' ? 'EMERGENCY DISPATCH INITIATED' : 'PREVENTATIVE DEPLOYMENT'}
                        </h4>
                        <p className="text-sm font-medium text-foreground-muted">
                          Density @ <span className="text-foreground font-bold">{latestAlert.location}</span>: {latestAlert.count.toLocaleString()} / Limit {latestAlert.limit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                        <div className="flex-1 md:flex-none px-6 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                            <p className="text-[9px] font-black uppercase tracking-widest text-foreground-muted mb-1">Response Action</p>
                            <div className="flex items-center gap-2 text-accent">
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-black uppercase italic tracking-tighter">{latestAlert.suggested_action}</span>
                            </div>
                        </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page Header */}
            <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-semibold text-foreground tracking-tight">Dashboard</h1>
                      {user && (
                        <div className={`badge ${user.role === 'admin' ? 'badge-accent' : 'badge-default'} flex items-center gap-1.5`}>
                          {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {user.role.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <p className="text-foreground-muted text-sm mt-0.5">Real-time crowd monitoring and analytics</p>
                </div>
                <div className="flex items-center gap-2">
                    {error && <span className="text-xs text-danger font-medium mr-2">{error}</span>}
                    
                    {/* Monitor Escalation Option */}
                    {user?.role === 'monitor' && (
                      <button 
                        onClick={handleEscalate}
                        disabled={isEscalating}
                        className="btn-secondary btn-sm border-danger/20 text-danger hover:bg-danger/10"
                      >
                        {isEscalating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                        ESCALATE INCIDENT
                      </button>
                    )}

                    <button 
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="btn-primary btn-sm"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
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
                {/* ... existing stats map ... */}
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
                <motion.div variants={item} className={`h-[420px] ${user?.role === 'admin' ? 'lg:col-span-2' : 'lg:col-span-2'}`}>
                    <VideoPlayer
                        image={data?.image || null}
                        isConnected={isConnected}
                        isSimulation={data?.is_simulation}
                        isHeatmapOn={data?.heatmap_on}
                        onToggleHeatmap={(val) => sendMessage({ action: "toggle_heatmap", value: val })}
                        canToggleHeatmap={user?.role === 'admin'}
                    />
                </motion.div>
                
                <motion.div variants={item} className="h-[420px]">
                    <MonitorInbox notifications={notifications} />
                </motion.div>

                {/* Second row for admins to show ZoneStatus */}
                {user?.role === 'admin' && (
                  <>
                    <motion.div variants={item} className="lg:col-span-2 h-[280px]">
                        <LiveDensityGraph
                            currentCount={data?.count || 0}
                            isConnected={isConnected}
                        />
                    </motion.div>
                    <motion.div variants={item} className="h-[280px]">
                        <ZoneStatus zones={data?.zones} />
                    </motion.div>
                  </>
                )}
            </motion.div>

            {/* Graph Section for non-admins */}
            {user?.role !== 'admin' && (
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
            )}
        </div>
    );
};

export default Dashboard;
