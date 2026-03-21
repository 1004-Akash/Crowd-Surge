import { LayoutDashboard, BarChart3, Settings, Zap, ChevronRight, LogOut, Circle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', description: 'Overview & monitoring' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics', description: 'Reports & insights' },
        { icon: Settings, label: 'Settings', path: '/settings', description: 'Configuration' },
    ];

    return (
        <aside className="w-[260px] h-screen flex flex-col bg-background-secondary/40 backdrop-blur-xl border-r border-border/50">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-5 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent/20 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100" />
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center shadow-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-foreground">CrowdSurge</h1>
                        <span className="text-xs text-foreground-muted">Enterprise v2.1</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto no-scrollbar">
                <p className="section-title px-3 mb-3">Menu</p>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className="block group"
                        >
                            <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-accent/10 text-accent'
                                    : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                                }`}>
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                                )}
                                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-accent/15' : 'group-hover:bg-background-elevated'
                                    }`}>
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium block">{item.label}</span>
                                    {!isActive && (
                                        <span className="text-xs text-foreground-muted truncate block opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.description}
                                        </span>
                                    )}
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                            </div>
                        </NavLink>
                    );
                })}
            </nav>

            {/* System Status */}
            <div className="mx-3 mb-3">
                <div className="p-3 rounded-lg bg-success/5 border border-success/10">
                    <div className="flex items-center gap-2">
                        <Circle className="w-2 h-2 fill-success text-success animate-pulse-soft" />
                        <span className="text-xs font-medium text-success">All systems operational</span>
                    </div>
                </div>
            </div>

            {/* User Section */}
            <div className="p-3 border-t border-border/50">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-tertiary transition-colors cursor-pointer group">
                    <div className="avatar avatar-md">JD</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                        <p className="text-xs text-foreground-muted">Administrator</p>
                    </div>
                    <LogOut className="w-4 h-4 text-foreground-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
