import { motion } from 'framer-motion';
import type { ZoneData } from '../../hooks/useCrowdData';
import { MapPin, ArrowRight, Users } from 'lucide-react';

interface ZoneStatusProps {
    zones: ZoneData | undefined;
}

const ZONE_MAPPING = [
    { id: 'A', name: 'Main Entrance', backendKey: 'Zone_TL', capacity: 300 },
    { id: 'B', name: 'Food Court', backendKey: 'Zone_TR', capacity: 200 },
    { id: 'C', name: 'Stage Front', backendKey: 'Zone_BL', capacity: 400 },
    { id: 'D', name: 'Exit Corridor', backendKey: 'Zone_BR', capacity: 150 },
];

const getStatus = (count: number, capacity: number) => {
    const usage = count / capacity;
    if (usage > 0.8) return { label: 'Critical', color: 'danger' };
    if (usage > 0.5) return { label: 'Warning', color: 'warning' };
    return { label: 'Normal', color: 'success' };
};

const ZoneStatus = ({ zones }: ZoneStatusProps) => {
    const currentZones = ZONE_MAPPING.map(zone => {
        const count = zones ? (zones[zone.backendKey] || 0) : 0;
        const status = getStatus(count, zone.capacity);
        const percentage = Math.min(100, Math.round((count / zone.capacity) * 100));

        return { ...zone, status, percentage, count };
    });

    return (
        <div className="card h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" />
                    <h3 className="font-semibold text-foreground text-sm">Zone Overview</h3>
                </div>
                <span className="badge badge-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
                    Live
                </span>
            </div>

            {/* Zone List */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-2">
                {currentZones.map((zone, i) => (
                    <motion.div
                        key={zone.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.3 }}
                        className="p-3 rounded-lg hover:bg-background-tertiary/50 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center gap-3">
                            {/* Zone ID */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${zone.status.color === 'danger' ? 'bg-danger/10 text-danger' :
                                    zone.status.color === 'warning' ? 'bg-warning/10 text-warning' :
                                        'bg-accent/10 text-accent'
                                }`}>
                                {zone.id}
                            </div>

                            {/* Zone Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-foreground truncate">{zone.name}</span>
                                    <span className={`badge text-[10px] ${zone.status.color === 'danger' ? 'badge-danger' :
                                            zone.status.color === 'warning' ? 'badge-warning' : 'badge-success'
                                        }`}>
                                        {zone.status.label}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="progress-track">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${zone.percentage}%` }}
                                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: i * 0.1 }}
                                        className={`progress-fill ${zone.status.color === 'danger' ? 'bg-danger' :
                                                zone.status.color === 'warning' ? 'bg-warning' : 'bg-accent'
                                            }`}
                                    />
                                </div>

                                <div className="flex items-center justify-between mt-1.5 text-xs text-foreground-muted">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {zone.count}
                                    </span>
                                    <span>{zone.percentage}% of {zone.capacity}</span>
                                </div>
                            </div>

                            {/* Arrow */}
                            <ArrowRight className="w-4 h-4 text-foreground-subtle opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border/50">
                <button className="btn-secondary w-full text-sm justify-center">
                    View Detailed Map
                </button>
            </div>
        </div>
    );
};

export default ZoneStatus;
