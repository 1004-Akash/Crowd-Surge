import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Maximize2, AlertTriangle, Sparkles, Video, X, Settings2 } from 'lucide-react';

interface VideoPlayerProps {
    image: string | null;
    isConnected: boolean;
    isSimulation?: boolean;
    isHeatmapOn?: boolean;
    onToggleHeatmap?: (value: boolean) => void;
    canToggleHeatmap?: boolean;
}

const VideoPlayer = ({ image, isConnected, isSimulation = false, isHeatmapOn = true, onToggleHeatmap, canToggleHeatmap = true }: VideoPlayerProps) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
        if (onToggleHeatmap) {
            onToggleHeatmap(!isHeatmapOn);
        }
    };

    const Content = (maximized: boolean) => (
        <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse-soft' : 'bg-danger'}`} />
                        <span className="font-medium text-foreground text-sm">Live Feed</span>
                    </div>
                    {isConnected && (
                        <span className={`badge ${isSimulation ? 'badge-warning' : 'badge-success'}`}>
                            <Video className="w-3 h-3" />
                            {isSimulation ? 'Simulation' : 'HD 1080p'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleToggle}
                        disabled={!canToggleHeatmap}
                        title={!canToggleHeatmap ? "Administrator privileges required" : ""}
                        className={`btn btn-sm px-3 py-1.5 text-xs ${isHeatmapOn
                            ? 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
                            : 'bg-background-tertiary text-foreground-muted hover:text-foreground border border-border'
                            } ${!canToggleHeatmap ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Heatmap
                    </button>
                    <button className="btn-icon p-2">
                        <Settings2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsMaximized(!maximized)}
                        className="btn-icon p-2"
                    >
                        {maximized ? <X className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Video Area */}
            <div className={`relative flex-1 flex items-center justify-center bg-background ${maximized ? 'min-h-0' : ''}`}>
                {/* Scan Lines Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' }} />

                {isConnected && image ? (
                    <img
                        src={`data:image/jpeg;base64,${image}`}
                        alt="Live Feed"
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center p-8">
                        <div className="w-16 h-16 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-warning" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-foreground">No Signal</p>
                            <p className="text-sm text-foreground-muted mt-1">Waiting for video stream...</p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button className="btn-secondary btn-sm">Retry Connection</button>
                        </div>
                    </div>
                )}

                {/* Recording Indicator */}
                {isConnected && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse-soft" />
                        <span className="text-xs font-medium text-foreground-secondary">REC</span>
                    </div>
                )}

                {/* Timestamp */}
                {isConnected && (
                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-md border border-border/50">
                        <span className="text-xs font-mono text-foreground-secondary">
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                )}
            </div>
        </>
    );

    if (isMaximized) {
        return createPortal(
            <div className="fixed inset-0 z-50 flex flex-col bg-background">
                <div className="fixed inset-0 bg-background" onClick={() => setIsMaximized(false)} />
                <div className="relative z-10 flex flex-col h-full m-4 md:m-8 card overflow-hidden">
                    {Content(true)}
                </div>
            </div>,
            document.body
        );
    }

    return (
        <div ref={containerRef} className="card h-full flex flex-col overflow-hidden">
            {Content(false)}
        </div>
    );
};

export default VideoPlayer;
