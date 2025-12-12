import React from 'react';
import { VideoContent, Song } from '../types';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, DollarSign } from 'lucide-react';

interface AdminReviewProps {
  videos: VideoContent[];
  songs: Song[];
  onReviewAction: (videoId: string, status: 'approved' | 'rejected') => void;
}

export const AdminReview: React.FC<AdminReviewProps> = ({ videos, songs, onReviewAction }) => {
  // Filter for pending matches
  const pendingVideos = videos.filter(v => v.isMatch && v.status === 'pending');

  const getMatchedSong = (songId?: string) => songs.find(s => s.id === songId);

  if (pendingVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-slate-900 rounded-xl border border-slate-800">
        <div className="bg-slate-800 p-4 rounded-full mb-4">
            <CheckCircle className="text-green-400 w-8 h-8" />
        </div>
        <p className="text-slate-400">All caught up! No videos pending review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Content Review Queue</h2>
      <div className="grid gap-4">
        {pendingVideos.map((video) => {
          const song = getMatchedSong(video.matchedSongId);
          return (
            <div key={video.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all">
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Video Info */}
                <div className="md:col-span-5 space-y-3">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {video.id.slice(-8)}
                      </span>
                      <a href={video.url} target="_blank" rel="noreferrer" className="flex items-center text-xs text-cyan-400 hover:text-cyan-300">
                        View on TikTok <ExternalLink size={12} className="ml-1" />
                      </a>
                   </div>
                   <h3 className="font-semibold text-white truncate">@{video.author}</h3>
                   <p className="text-sm text-slate-400 line-clamp-2 italic">"{video.description}"</p>
                   
                   <div className="flex gap-4 text-sm mt-2">
                      <div>
                        <span className="text-slate-500 block text-xs uppercase">Views</span>
                        <span className="text-white font-medium">{video.metrics.views.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs uppercase">Confidence</span>
                        <span className={`font-medium ${video.matchConfidence > 0.8 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {(video.matchConfidence * 100).toFixed(0)}%
                        </span>
                      </div>
                   </div>
                </div>

                {/* Match Info & Revenue */}
                <div className="md:col-span-4 bg-slate-950/50 rounded-lg p-4 border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Matched Asset</p>
                    {song ? (
                        <div className="space-y-2">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-pink-500/20 rounded flex items-center justify-center text-pink-500">
                                    <dollarSign size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{song.title}</p>
                                    <p className="text-xs text-slate-400">{song.artist}</p>
                                </div>
                             </div>
                             <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center">
                                <span className="text-xs text-slate-500">Est. Payout</span>
                                <span className="text-sm font-bold text-green-400">
                                    {song.revenueModel.currency} {video.estimatedRevenue.toLocaleString()}
                                </span>
                             </div>
                             <p className="text-[10px] text-slate-500">
                                Rate: {song.revenueModel.rate} {song.revenueModel.currency} / {song.revenueModel.type === 'flat_per_1k_views' ? '1k Views' : 'Post'}
                             </p>
                        </div>
                    ) : (
                        <p className="text-red-400 text-sm">Asset reference missing</p>
                    )}
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex flex-col justify-center gap-3 border-l border-slate-800 pl-6">
                    <button
                        onClick={() => onReviewAction(video.id, 'approved')}
                        className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                        <CheckCircle size={16} /> Approve
                    </button>
                    <button
                        onClick={() => onReviewAction(video.id, 'rejected')}
                        className="w-full bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors border border-slate-700 hover:border-red-900/50"
                    >
                        <XCircle size={16} /> Reject
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};