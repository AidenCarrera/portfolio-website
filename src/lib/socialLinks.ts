import { FaLinkedin } from "react-icons/fa6";
import { SiGithub, SiInstagram, SiSpotify, SiYoutube } from "react-icons/si";

export const socialLinks = [
  {
    icon: SiGithub,
    url: "https://github.com/aidencarrera",
    label: "GitHub",
    color: "hover:text-purple-400",
  },
  {
    icon: FaLinkedin,
    url: "https://linkedin.com/in/aiden-carrera",
    label: "LinkedIn",
    color: "hover:text-blue-400",
  },
  {
    icon: SiSpotify,
    url: "https://open.spotify.com/artist/1LgE8yhi5cPt1uBQPzaRAe",
    label: "Spotify",
    color: "hover:text-green-400",
  },
  {
    icon: SiInstagram,
    url: "https://instagram.com/aiden.carrera",
    label: "Instagram",
    color: "hover:text-pink-400",
  },
  {
    icon: SiYoutube,
    url: "https://youtube.com/@aidencarrera",
    label: "YouTube",
    color: "hover:text-red-400",
  },
] as const;
