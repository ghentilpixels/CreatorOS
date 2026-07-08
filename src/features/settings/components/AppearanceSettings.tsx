"use client";

import { Moon, Sun, Monitor } from "lucide-react";

export function AppearanceSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Appearance</h3>
        <p className="text-sm text-zinc-400">
          Customize how CreatorOS looks on your device.
        </p>
      </div>

      <div className="h-px bg-white/10" />

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-purple-500 bg-white/5 hover:bg-white/10 transition-colors">
            <Monitor className="h-8 w-8 text-white mb-3" />
            <span className="text-sm font-medium text-white">System</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <Sun className="h-8 w-8 text-zinc-400 mb-3" />
            <span className="text-sm font-medium text-zinc-300">Light</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/10 bg-black/50 hover:bg-black/80 transition-colors">
            <Moon className="h-8 w-8 text-zinc-400 mb-3" />
            <span className="text-sm font-medium text-zinc-300">Dark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
