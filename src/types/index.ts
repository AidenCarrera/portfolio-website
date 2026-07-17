export interface MusicTrack {
  id: string;
  title: string;
  spotify_embed_url: string;
}

export interface MusicSnippet {
  id: string;
  title: string;
  audio_url: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: string;
  description?: string;
}
