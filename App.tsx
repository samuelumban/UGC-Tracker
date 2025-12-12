import React, { useState, useMemo } from 'react';
import { Song, VideoContent } from './types';
import { SongManager } from './components/SongManager';
import { VideoTracker } from './components/VideoTracker';
import { StatCard } from './components/StatCard';
import { DashboardCharts } from './components/DashboardCharts';
import { Sidebar } from './components/Sidebar';
import { AdminReview } from './components/AdminReview';
import { Eye, Heart, DollarSign, Share2, Music2 } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [role, setRole] = useState<'creator' | 'admin'>('creator');
  const [currentView, setCurrentView] = useState('dashboard');

  // Application Data State
  const [songs, setSongs] = useState<Song[]>([
    {
      id: '7565837379473229825',
      url: 'https://www.tiktok.com/music/Astagfirullah-7565837379473229825',
      title: 'Astagfirullah (Official)',
      artist: 'Unknown Artist',
      revenueModel: { type: 'flat_per_1k_views', rate: 5000, currency: 'IDR' }
    }
  ]);

  const [videos, setVideos] = useState<VideoContent[]>([]);

  // Computed Stats
  const stats = useMemo(() => {
    return videos.reduce((acc, video) => {
      // Only approved videos count towards confirmed revenue
      if (video.status === 'approved') {
          acc.revenue += video.estimatedRevenue;
      }
      // Pending revenue
      if (video.status === 'pending' && video.isMatch) {
          acc.pendingRevenue += video.estimatedRevenue;
      }
      
      // Engagement totals (regardless of status for now, or maybe only approved?)
      // Let's count all tracked for engagement visibility
      acc.views += video.metrics.views;
      acc.likes += video.metrics.likes;
      acc.shares += video.metrics.shares;
      if (video.isMatch) acc.matchedCount += 1;
      
      return acc;
    }, { views: 0, likes: 0, shares: 0, matchedCount: 0, revenue: 0, pendingRevenue: 0 });
  }, [videos]);

  // Actions
  const handleAddSong = (newSong: Song) => {
    if (!songs.some(s => s.id === newSong.id)) {
      setSongs([...songs, newSong]);
    }
  };

  const handleRemoveSong = (id: string) => {
    setSongs(songs.filter(s => s.id !== id));
  };

  const handleAddVideo = (newVideo: VideoContent) => {
      if (!videos.some(v => v.url === newVideo.url)) {
          setVideos(prev => [...prev, newVideo]);
      } else {
          setVideos(prev => prev.map(v => v.url === newVideo.url ? newVideo : v));
      }
  };

  const handleReviewAction = (videoId: string, status: 'approved' | 'rejected') => {
      setVideos(prev => prev.map(v => {
          if (v.id !== videoId) return v;
          return {
              ...v,
              status: status,
              // If rejected, remove estimate? No, keep it but maybe it doesn't count to total
              lastUpdated: new Date().toLocaleTimeString()
          }
      }));
  };

  // Render Views
  const renderContent = () => {
    // ADMIN DASHBOARD
    if (role === 'admin' && currentView === 'admin-dashboard') {
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Platform Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Pending Revenue" value={stats.pendingRevenue} icon={<DollarSign />} colorClass="text-yellow-400" />
                    <StatCard label="Paid Revenue" value={stats.revenue} icon={<DollarSign />} colorClass="text-green-400" />
                    <StatCard label="Total Matches" value={stats.matchedCount} icon={<Music2 />} colorClass="text-purple-400" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DashboardCharts videos={videos} />
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-white font-bold mb-4">Pending Approvals</h3>
                        <p className="text-3xl font-bold text-white">{videos.filter(v => v.status === 'pending' && v.isMatch).length}</p>
                        <button onClick={() => setCurrentView('admin-review')} className="text-cyan-400 text-sm mt-2 hover:underline">Go to Queue &rarr;</button>
                    </div>
                </div>
            </div>
        );
    }

    if (role === 'admin' && currentView === 'admin-review') {
        return <AdminReview videos={videos} songs={songs} onReviewAction={handleReviewAction} />;
    }

    if (role === 'admin' && currentView === 'admin-songs') {
        return <SongManager songs={songs} role="admin" onAddSong={handleAddSong} onRemoveSong={handleRemoveSong} />;
    }

    // CREATOR DASHBOARD
    if (role === 'creator' && currentView === 'dashboard') {
        return (
            <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Earnings" value={stats.revenue} icon={<DollarSign />} colorClass="text-green-400" />
                    <StatCard label="Views" value={stats.views} icon={<Eye />} colorClass="text-cyan-400" />
                    <StatCard label="Likes" value={stats.likes} icon={<Heart />} colorClass="text-pink-500" />
                    <StatCard label="Shares" value={stats.shares} icon={<Share2 />} colorClass="text-purple-400" />
                 </div>
                 <DashboardCharts videos={videos} />
            </div>
        );
    }

    if (role === 'creator' && currentView === 'videos') {
        return <VideoTracker songs={songs} videos={videos} onAddVideo={handleAddVideo} />;
    }

    if (role === 'creator' && currentView === 'library') {
        return <SongManager songs={songs} role="creator" onAddSong={handleAddSong} onRemoveSong={handleRemoveSong} />;
    }

    return <div>View Not Found</div>;
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <Sidebar 
        currentView={currentView} 
        role={role} 
        onNavigate={(view) => setCurrentView(view)} 
        onToggleRole={() => {
            setRole(r => r === 'admin' ? 'creator' : 'admin');
            setCurrentView(role === 'admin' ? 'dashboard' : 'admin-dashboard');
        }}
      />
      
      <main className="ml-64 p-8">
         <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <div>
                <h2 className="text-xl font-semibold capitalize">{currentView.replace('-', ' ')}</h2>
                <p className="text-sm text-slate-500">Welcome back, {role}</p>
            </div>
            <div className="text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-400 font-mono">
                v1.0.2-beta
            </div>
         </header>
         
         <div className="max-w-6xl mx-auto">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default App;
