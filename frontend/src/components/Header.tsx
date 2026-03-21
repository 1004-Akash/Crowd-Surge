import { Bell, Search } from 'lucide-react';

interface HeaderProps {
    isConnected?: boolean;
}

const Header = ({ isConnected = false }: HeaderProps) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
            {/* Left - Greeting */}
            <div className="flex items-center gap-4">
                <div>
                    <p className="text-foreground-muted text-sm">{getGreeting()}</p>
                    <h2 className="text-foreground font-semibold">Welcome back, John</h2>
                </div>
            </div>

            {/* Right - Search & Actions */}
            <div className="flex items-center gap-3">
                {/* Status Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected
                    ? 'bg-success/10 text-success border border-success/20'
                    : 'bg-danger/10 text-danger border border-danger/20'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success' : 'bg-danger animate-pulse-soft'}`} />
                    {isConnected ? 'Connected' : 'Offline'}
                </div>

                {/* Search */}
                <div className="relative group hidden md:block">
                    <Search className="w-4 h-4 text-foreground-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input pl-9 pr-16 py-2 w-56 text-sm bg-background-tertiary/30"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] bg-background-tertiary text-foreground-muted rounded border border-border font-mono">
                        ⌘K
                    </kbd>
                </div>

                {/* Notifications */}
                <button className="btn-icon relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
                </button>
            </div>
        </header>
    );
};

export default Header;
