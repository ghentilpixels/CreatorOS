"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Save } from "lucide-react";

export function IntegrationsSettings() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [showKey, setShowKey] = useState(false);
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
        <h3 className="text-lg font-medium text-white">Integrations</h3>
        <p className="text-sm text-zinc-400">
          Manage your API keys and third-party services.
        </p>
      </div>

      <div className="h-px bg-white/10" />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <label htmlFor="openai-key" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Key className="h-4 w-4" />
              OpenAI API Key
            </label>
            <div className="relative">
              <input
                id="openai-key"
                type={showKey ? "text" : "password"}
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 pr-10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500">
              Required for AI features like script generation and research. Your key is stored securely.
            </p>
          </div>
        </div>

        <div className="flex justify-start max-w-xl">
          <button
            type="submit"
            disabled={isLoading || !openAIKey}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Key
          </button>
        </div>
      </form>
    </div>
  );
}
