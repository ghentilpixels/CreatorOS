"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function IntegrationsSettings() {
  const [openAIKey, setOpenAIKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <p className="text-sm text-zinc-400 -mt-4">
            Manage your API keys and third-party services.
          </p>
          <div className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="openai-key" className="text-zinc-300">
                OpenAI API Key
              </Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showKey ? "text" : "password"}
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="sk-..."
                  className="pr-10"
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
            <Button type="submit" disabled={isLoading || !openAIKey}>
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Key
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
