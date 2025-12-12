import React from 'react';
import { VideoContent } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardChartsProps {
  videos: VideoContent[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ videos }) => {
  // Only show charts if we have videos
  if (videos.length === 0) return null;

  // Prepare data: Top 5 videos by views
  const data = [...videos]
    .sort((a, b) => b.metrics.views - a.metrics.views)
    .slice(0, 5)
    .map(v => ({
      name: v.author,
      views: v.metrics.views,
      likes: v.metrics.likes,
      comments: v.metrics.comments
    }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg h-[400px]">
      <h3 className="text-lg font-bold text-white mb-6">Engagement Overview (Top 5 Videos)</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              cursor={{fill: '#1e293b'}}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
            <Bar dataKey="views" fill="#22d3ee" name="Views" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="likes" fill="#ec4899" name="Likes" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
