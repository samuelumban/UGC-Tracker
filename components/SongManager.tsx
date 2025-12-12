import React, { useState } from 'react';
import { Song, RevenueModel } from '../types';
import { Music, Plus, Trash2, Link as LinkIcon, User, Coins } from 'lucide-react';

interface SongManagerProps {
  songs: Song[];
  role: 'creator' | 'admin';
  onAddSong: (song: Song) => void;
  onRemoveSong: (id: string) => void;
}

export const SongManager: React.FC<SongManagerProps> = ({ songs, role, onAddSong, onRemoveSong }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [rate, setRate] = useState<number>(5000);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    // Basic extraction of ID from URL
    const idMatch = url.match(/music\/[^/]+-(\d+)/);
    const id = idMatch ? idMatch[1] : Date.now().toString();

    const newSong: Song = {
      id,
      url,
      title,
      artist: artist || 'Unknown Artist',
      revenueModel: {
        type: 'flat_per_1k_views',
        rate: rate,
        currency: 'IDR'
      }
    };

    onAddSong(newSong);
    // Reset form
    setUrl('');
    setTitle('');
    setArtist('');
    setRate(5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-white">Song Registry</h2>
            <p className="text-slate-400 text-sm">Manage assets and revenue rules.</p>
        </div>
        {role === 'creator' && <div className="text-xs bg-slate-800 px-3 py-1 rounded text-slate-400">Read Only Mode</div>}
      </div>

      {role === 'admin' && (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Plus size={18} className="text-pink-500" /> Add New Asset
        </h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Song URL (TikTok)</label>
                    <div className="flex bg-slate-950 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors">
                        <div className="p-2.5 text-slate-500"><LinkIcon size={16} /></div>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://tiktok.com/music/..."
                            className="bg-transparent border-none text-white text-sm w-full focus:ring-0 placeholder-slate-600"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Title</label>
                    <div className="flex bg-slate-950 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors">
                        <div className="p-2.5 text-slate-500"><Music size={16} /></div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Song Title"
                            className="bg-transparent border-none text-white text-sm w-full focus:ring-0 placeholder-slate-600"
                        />
                    </div>
                </div>
            </div>
            
            <div className="space-y-4">
                 <div>
                    <label className="block text-xs text-slate-400 mb-1">Artist</label>
                    <div className="flex bg-slate-950 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors">
                        <div className="p-2.5 text-slate-500"><User size={16} /></div>
                        <input
                            type="text"
                            value={artist}
                            onChange={(e) => setArtist(e.target.value)}
                            placeholder="Artist Name"
                            className="bg-transparent border-none text-white text-sm w-full focus:ring-0 placeholder-slate-600"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-slate-400 mb-1">Rate (IDR per 1,000 Views)</label>
                    <div className="flex bg-slate-950 rounded-lg border border-slate-700 focus-within:border-pink-500 transition-colors">
                        <div className="p-2.5 text-slate-500"><Coins size={16} /></div>
                        <input
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(parseInt(e.target.value))}
                            className="bg-transparent border-none text-white text-sm w-full focus:ring-0 placeholder-slate-600"
                        />
                    </div>
                </div>
            </div>
            
            <div className="md:col-span-2 pt-2">
                <button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                <Plus size={16} className="mr-2" /> Register Asset
                </button>
            </div>
        </form>
      </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {songs.length === 0 && (
          <p className="text-slate-500 text-center text-sm py-10 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed">
            No songs registered in the library.
          </p>
        )}
        {songs.map((song) => (
          <div key={song.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center border border-slate-700 text-slate-400">
                    <Music size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                    <p className="text-xs text-slate-400">{song.artist}</p>
                    <div className="flex gap-3 mt-1">
                        <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded border border-green-900/50">
                            {song.revenueModel.currency} {song.revenueModel.rate}/1k
                        </span>
                        <a href={song.url} target="_blank" className="text-[10px] text-cyan-500 hover:underline flex items-center gap-1">
                            TikTok Link <LinkIcon size={8} />
                        </a>
                    </div>
                </div>
            </div>
            {role === 'admin' && (
                <button
                onClick={() => onRemoveSong(song.id)}
                className="text-slate-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-900/10 transition-colors"
                title="Remove Song"
                >
                <Trash2 size={18} />
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};