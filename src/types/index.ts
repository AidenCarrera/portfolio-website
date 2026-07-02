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

