import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Zap, AlertCircle, CheckCircle2, Siren } from 'lucide-react';
import type { Notification } from '../../hooks/useNotifications';

interface MonitorInboxProps {
  notifications: Notification[];
}

const MonitorInbox = ({ notifications }: MonitorInboxProps) => {
  const monitorAlerts = notifications.filter(n => n.type === 'MONITOR_ALERT');

  return (
    <div className="flex flex-col h-full glass border-white/[0.08] overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-accent" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full animate-ping" />
          </div>
          <h3 className="font-bold text-xs uppercase tracking-wider">Monitor Inbox</h3>
        </div>
        <div className="badge badge-default text-[10px] font-bold">{monitorAlerts.length} ACTIVE</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {monitorAlerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-8"
            >
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <p className="text-sm font-medium text-foreground tracking-tight">System Secured</p>
              <p className="text-xs text-foreground-muted mt-1">No critical crowd signals detected.</p>
            </motion.div>
          ) : (
            monitorAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                  alert.status === 'CRITICAL' 
                    ? 'bg-danger/5 border-danger/20 hover:border-danger/40' 
                    : 'bg-warning/5 border-warning/20 hover:border-warning/40'
                }`}
              >
                {/* 1. Status Indicator Bar */}
                <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${
                  alert.status === 'CRITICAL' ? 'bg-danger shadow-glow-danger' : 'bg-warning shadow-glow-warning'
                }`} />

                <div className="pl-2 space-y-4">
                  {/* Header: Date & Time */}
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-foreground-muted">
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {alert.timestamp}</span>
                      <span>{alert.date}</span>
                    </div>
                    {alert.status === 'CRITICAL' && <Siren className="w-4 h-4 text-danger animate-pulse" />}
                  </div>

                  {/* 📍 Location Details */}
                  <div className="grid grid-cols-3 gap-2 p-2 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                    <div>
                      <p className="text-[8px] font-black text-foreground-muted uppercase tracking-tighter opacity-70">Location</p>
                      <p className="text-[10px] font-bold text-foreground">{alert.location}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-foreground-muted uppercase tracking-tighter opacity-70">Zone</p>
                      <p className="text-[10px] font-bold text-foreground">{alert.zone}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-foreground-muted uppercase tracking-tighter opacity-70">Sensor ID</p>
                      <p className="text-[10px] font-bold text-foreground font-mono">{alert.camera_id}</p>
                    </div>
                  </div>

                  {/* 👥 Crowd Data & 🚦 Status */}
                  <div className="flex items-center justify-between py-1 border-y border-white/[0.05]">
                    <div>
                        <p className="text-[8px] font-black text-foreground-muted uppercase tracking-tighter opacity-70">Status / Response</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                alert.status === 'CRITICAL' ? 'bg-danger text-white' : 'bg-warning text-black'
                            }`}>{alert.status}</span>
                            <span className="text-[10px] font-bold text-foreground-muted">Limit: {alert.limit.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-foreground-muted uppercase tracking-tighter opacity-70">Density / Trend</p>
                        <div className="flex items-center justify-end gap-2 mt-0.5">
                            <span className={`text-[9px] font-bold ${alert.trend === 'Increasing' ? 'text-danger' : 'text-success'}`}>{alert.trend}</span>
                            <span className="text-xs font-black text-foreground">{alert.count.toLocaleString()}</span>
                        </div>
                    </div>
                  </div>

                  {/* ⚠️ Reason & Suggested Action */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-foreground-muted mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-[10px] font-medium text-foreground leading-snug">{alert.reason}</p>
                            <div className="mt-1 flex items-center gap-1.5 p-1.5 bg-accent/5 rounded border border-accent/10">
                                <Zap className="w-3 h-3 text-accent" />
                                <p className="text-[10px] font-bold text-accent italic tracking-tight">{alert.suggested_action}</p>
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* 📩 Admin Info & 👮 Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-dashed border-white/[0.1]">
                    <div className="flex gap-2">
                        <span className="px-1.5 py-0.5 bg-foreground/5 rounded text-[8px] font-black uppercase text-foreground-muted border border-white/5">
                            {alert.priority} Priority
                        </span>
                        <span className="px-1.5 py-0.5 bg-foreground/5 rounded text-[8px] font-black uppercase text-foreground-muted border border-white/5 italic">
                            {alert.inbox_status}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-[9px] font-bold text-accent uppercase tracking-wider">{alert.action_taken}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MonitorInbox;
