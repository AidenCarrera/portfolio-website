import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiSpotify, SiYoutube } from "react-icons/si";
import type { IconType } from "react-icons";
import { getGitHubProfileUrl } from "@/lib/github";

interface SocialLink {
  icon: IconType;
  url: string;
  label: string;
  color: string;
}

const spotifyArtistId = process.env.SPOTIFY_ARTIST_ID?.trim();

const configuredSocialLinks: Array<SocialLink | null> = [
  {
    icon: SiGithub,
    url: getGitHubProfileUrl() ?? "",
    label: "GitHub",
    color: "hover:text-purple-400",
  },
  {
    icon: FaLinkedin,
    url: process.env.LINKEDIN_URL?.trim() ?? "",
    label: "LinkedIn",
    color: "hover:text-blue-400",
  },
  {
    icon: SiSpotify,
    url: spotifyArtistId
      ? `https://open.spotify.com/artist/${encodeURIComponent(spotifyArtistId)}`
      : "",
    label: "Spotify",
    color: "hover:text-green-400",
  },
  {
    icon: SiInstagram,
    url: process.env.INSTAGRAM_URL?.trim() ?? "",
    label: "Instagram",
    color: "hover:text-pink-400",
  },
  {
    icon: SiYoutube,
    url: process.env.YOUTUBE_URL?.trim() ?? "",
    label: "YouTube",
    color: "hover:text-red-400",
  },
];

export const socialLinks = configuredSocialLinks.filter(
  (link): link is SocialLink => Boolean(link?.url),
);
