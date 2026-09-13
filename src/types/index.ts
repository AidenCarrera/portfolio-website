export interface GithubRepo {
  name: string;
  description: string;
  url: string;
  homepageUrl: string | null;
  topics: string[];
  isCollab: boolean;
  createdAt: string;
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
