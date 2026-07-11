"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { getIntegrations } from "@/features/publishing/actions";
import { IntegrationCard } from "@/features/publishing/components/IntegrationCard";
import { PublishComposer } from "@/features/publishing/components/PublishComposer";
import { PostQueue } from "@/features/publishing/components/PostQueue";
import { Button } from "@/components/ui/button";
import type { IntegrationPlatform } from "@/lib/types";

interface Integration {
  platform: IntegrationPlatform;
  status: "connected" | "disconnected" | "expired" | "error";
  accountName: string | null;
}

export default function PublishPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchIntegrations = async () => {
    setLoading(true);
    setError(null);
    const result = await getIntegrations();
    if (result.success && "integrations" in result) {
      setIntegrations(result.integrations as Integration[]);
    } else {
      setError(result.error ?? "Failed to load integrations");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-glow flex items-center gap-3">
            <div className="p-2 bg-emerald-500/15 rounded-xl">
              <Share2 className="w-6 h-6 text-emerald-400" />
            </div>
            Publish
          </h1>
          <p className="text-muted-foreground mt-1">Create, schedule, and publish to every platform.</p>
        </div>
        <Button
          variant="outline"
          onClick={fetchIntegrations}
          className="gap-2 border-white/10 bg-background/50 hover:bg-white/5"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass rounded-3xl flex flex-col items-center justify-center py-32 text-muted-foreground"
          >
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-400" />
            <p className="text-sm">Loading publishing workspace...</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Composer + Queue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PublishComposer onPublished={() => setRefreshKey((k) => k + 1)} />
              <PostQueue refreshKey={refreshKey} />
            </div>

            {/* Platform Integrations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Platform Integrations</h2>
                <span className="text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
                  {integrations.filter(i => i.status === "connected").length} of {integrations.length} connected
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {integrations.map((integration) => (
                  <IntegrationCard
                    key={integration.platform}
                    platform={integration.platform}
                    status={integration.status}
                    accountName={integration.accountName}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
