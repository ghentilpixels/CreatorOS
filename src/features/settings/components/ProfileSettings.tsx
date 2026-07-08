"use client";

import { useState } from "react";
import { User, Mail, Camera, Save } from "lucide-react";

export function ProfileSettings() {
  const [name, setName] = useState("Creator");
  const [email, setEmail] = useState("creator@example.com");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate save
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Profile</h3>
        <p className="text-sm text-zinc-400">
          This is how others will see you on the site.
        </p>
      </div>

      <div className="h-px bg-white/10" />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 group cursor-pointer">
            <User className="h-10 w-10 text-zinc-500" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <button type="button" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10">
              Change avatar
            </button>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <User className="h-4 w-4" />
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <p className="text-xs text-zinc-500">
              Your name may appear around CreatorOS where you contribute or are mentioned.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              disabled
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-zinc-400 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-500">
              Your email is managed by your authentication provider.
            </p>
          </div>
        </div>

        <div className="flex justify-end max-w-xl">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
