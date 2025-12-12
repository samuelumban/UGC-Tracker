export type VideoStatus = 'pending' | 'approved' | 'rejected' | 'change_requested';

export interface RevenueModel {
  type: 'flat_per_1k_views' | 'flat_per_post';
  rate: number;
  currency: string;
}

export interface Song {
  id: string;
  url: string;
  title: string;
  artist: string;
  revenueModel: RevenueModel;
}

export interface EngagementMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface VideoContent {
  id: string;
  url: string;
  author: string;
  description: string;
  metrics: EngagementMetrics;
  usedSongUrl?: string; // The song URL detected in the video
  matchedSongId?: string; // ID of the song from our list if matched
  isMatch: boolean;
  matchConfidence: number; // 0.0 to 1.0
  status: VideoStatus;
  estimatedRevenue: number;
  lastUpdated: string;
}

export interface AnalysisResult {
  metrics: EngagementMetrics;
  author: string;
  description: string;
  detectedSongUrl: string;
  matchConfidence: number;
}
