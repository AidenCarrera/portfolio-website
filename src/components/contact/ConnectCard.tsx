import { socialLinks } from "@/lib/socialLinks";

export default function ConnectCard() {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">Connect</h2>
      <div className="space-y-3">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-4 p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-brand/50 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${link.color}`}
          >
            <link.icon
              size={24}
              className="text-slate-400 group-hover:text-current transition-colors"
            />
            <span className="text-slate-300 group-hover:text-white transition-colors font-medium">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
