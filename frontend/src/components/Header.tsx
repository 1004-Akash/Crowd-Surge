import { useState } from 'react';
import { Bell, LogOut, User, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    isConnected?: boolean;
}



import { useNotifications } from '../hooks/useNotifications';

const Header = ({ isConnected = false }: HeaderProps) => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const { notifications, isOnline, clearNotifications } = useNotifications(token);
    const [showNotifications, setShowNotifications] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };



    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
            {/* Left - Greeting */}
            <div className="flex items-center gap-4">
                <div className="avatar avatar-md border border-accent/20">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-foreground-muted text-[10px] font-bold uppercase tracking-widest">{getGreeting()}</p>
                    <h2 className="text-foreground font-bold tracking-tight">
                      {user ? `Officer ${user.full_name.split(' ')[0]}` : 'Personnel'}
                    </h2>
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-4">
                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isOnline
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-danger/10 text-danger border border-danger/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-success shadow-glow-success' : 'bg-danger animate-pulse-soft'}`} />
                    {isOnline ? 'System Live' : 'System Link Error'}
                </div>

                {/* Notifications Panel */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`btn-icon relative transition-colors ${notifications.length > 0 ? 'text-accent' : ''}`}
                  >
                      <Bell className="w-5 h-5" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-[10px] text-white flex items-center justify-center rounded-full font-bold border-2 border-background ring-2 ring-danger/20">
                          {notifications.length}
                        </span>
                      )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-80 glass z-50 overflow-hidden shadow-2xl border-white/[0.08]"
                      >
                        <div className="p-4 border-b border-border flex items-center justify-between bg-white/[0.02]">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-accent" />
                            <span className="font-bold text-xs uppercase tracking-wider">Signals Inbox</span>
                          </div>
                          <button onClick={clearNotifications} className="text-[10px] font-bold text-foreground-muted hover:text-foreground">CLEAR ALL</button>
                        </div>
                        <div className="max-h-96 overflow-y-auto p-2 space-y-2">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center">
                              <Bell className="w-8 h-8 text-foreground-muted/20 mx-auto mb-2" />
                              <p className="text-xs text-foreground-muted font-medium uppercase tracking-wider">No active signals</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="p-3 bg-background-tertiary/50 rounded-lg border border-border/50 hover:border-accent/30 transition-colors group">
                                <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-danger px-1.5 py-0.5 bg-danger/10 rounded uppercase tracking-widest">{n.type}</span>
                                  <span className="text-[10px] text-foreground-muted flex items-center gap-1 font-medium">
                                    <Clock className="w-3 h-3" />
                                    {n.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm font-medium text-foreground leading-snug">{n.message}</p>
                                <div className="mt-2 text-[10px] text-foreground-muted font-bold uppercase tracking-wider opacity-60">From: {n.sender}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="divider w-px h-8 mx-1" />

                {/* Logout */}
                <button 
                  onClick={handleLogout}
                  className="btn-ghost btn-sm text-danger hover:bg-danger/10 gap-2 font-bold text-xs"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:inline">SECURE EXIT</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
