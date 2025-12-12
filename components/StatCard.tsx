import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex items-center shadow-lg hover:border-slate-700 transition-colors">
      <div className={`p-4 rounded-full bg-opacity-10 ${colorClass} bg-current mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value.toLocaleString()}</h3>
      </div>
    </div>
  );
};
