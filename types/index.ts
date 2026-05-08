export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  github_url?: string;
  demo_url?: string;
  category?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  spotify_embed_url?: string;
  caption?: string;
  release_date?: string;
}

export interface MusicSnippet {
  id: string;
  title: string;
  audio_url: string;
  caption?: string;
  gear_used?: string;
  status?: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  description?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
}
