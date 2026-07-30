export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  isCollab: boolean;
  createdAt: string;
  priority: number;
  isFeatured: boolean;
}

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
