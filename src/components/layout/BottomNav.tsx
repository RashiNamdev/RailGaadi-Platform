import React from 'react';
import { Home, Map, Heart, Compass } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

export const BottomNav: React.FC = () => {
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);

  const tabs = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'map', label: 'Live Map', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: Heart },
    { id: 'companion', label: 'Places & Weather', icon: Compass },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2 flex items-center justify-around subtle-shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-blue-600 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
