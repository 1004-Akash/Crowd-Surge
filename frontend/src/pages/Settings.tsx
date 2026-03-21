import { motion } from 'framer-motion';
import { Save, AlertTriangle, Bell, Sliders, Monitor } from 'lucide-react';

const Settings = () => {
    const item = {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <motion.div variants={item} initial="hidden" animate="show">
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">Settings</h1>
                <p className="text-foreground-muted text-sm mt-0.5">Configure system parameters and preferences</p>
            </motion.div>

            {/* Settings Sections */}
            <motion.div variants={item} initial="hidden" animate="show" className="space-y-6">

                {/* Alert Thresholds */}
                <div className="card">
                    <div className="p-4 border-b border-border/50 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-warning/10">
                            <Sliders className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-sm">Alert Thresholds</h3>
                            <p className="text-xs text-foreground-muted">Configure density warning levels</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex gap-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
                            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                            <p className="text-sm text-foreground-secondary">
                                Changing thresholds will trigger a system-wide recalculation. This may take a few moments.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Warning Threshold</label>
                                <div className="relative">
                                    <input type="number" defaultValue={65} className="input pr-10" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">%</span>
                                </div>
                                <p className="text-xs text-foreground-muted mt-1.5">Triggers yellow warning state</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Critical Threshold</label>
                                <div className="relative">
                                    <input type="number" defaultValue={85} className="input pr-10" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">%</span>
                                </div>
                                <p className="text-xs text-foreground-muted mt-1.5">Triggers red critical state</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="card">
                    <div className="p-4 border-b border-border/50 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10">
                            <Bell className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                            <p className="text-xs text-foreground-muted">Manage alert preferences</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        {[
                            { label: 'Push notifications', desc: 'Receive browser push alerts', checked: true },
                            { label: 'Email alerts', desc: 'Send critical alerts via email', checked: false },
                            { label: 'Sound alerts', desc: 'Play audio on critical events', checked: true },
                        ].map((item) => (
                            <label key={item.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-background-tertiary/50 transition-colors cursor-pointer group">
                                <div>
                                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                                    <p className="text-xs text-foreground-muted">{item.desc}</p>
                                </div>
                                <input
                                    type="checkbox"
                                    defaultChecked={item.checked}
                                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent focus:ring-offset-background"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                {/* Display Settings */}
                <div className="card">
                    <div className="p-4 border-b border-border/50 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple/10">
                            <Monitor className="w-4 h-4 text-purple" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground text-sm">Display</h3>
                            <p className="text-xs text-foreground-muted">Visual preferences</p>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Refresh Interval</label>
                            <select className="input" defaultValue="500">
                                <option value="250">250ms (High CPU)</option>
                                <option value="500">500ms (Recommended)</option>
                                <option value="1000">1000ms (Low CPU)</option>
                            </select>
                        </div>
                    </div>
                </div>

            </motion.div>

            {/* Save Button */}
            <motion.div variants={item} initial="hidden" animate="show" className="flex justify-end pt-4">
                <button className="btn-primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </motion.div>
        </div>
    );
};

export default Settings;
