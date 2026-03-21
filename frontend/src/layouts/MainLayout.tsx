import React, { type ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 bg-gradient-mesh pointer-events-none" />
            <div className="fixed inset-0 bg-grid-pattern bg-[size:32px_32px] pointer-events-none opacity-50" />

            {/* Noise Texture */}
            <div className="fixed inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay" />

            {/* Floating Gradient Orbs */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[100px] animate-float pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple/[0.03] rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: '-4s' }} />

            <div className="relative z-10 flex w-full h-full">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto no-scrollbar">
                        <div className="max-w-7xl mx-auto px-6 py-6">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
