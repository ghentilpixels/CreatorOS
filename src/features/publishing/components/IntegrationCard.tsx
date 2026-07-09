"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle, AlertCircle, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectPlatform, disconnectPlatform } from "../actions";
import { PLATFORM_META } from "../services/platforms";
import type { IntegrationPlatform } from "@/lib/types";

interface IntegrationCardProps {
  platform: IntegrationPlatform;
  status: "connected" | "disconnected" | "expired" | "error";
  accountName: string | null;
}

export function IntegrationCard({ platform, status, accountName }: IntegrationCardProps) {
  const [loading, setLoading] = useState(false);
  const meta = PLATFORM_META[platform];

  const handleConnect = async () => {
    setLoading(true);
    const result = await connectPlatform(platform);
    setLoading(false);
    if (result.success && result.authUrl) {
      // In production, redirect to OAuth consent screen
      window.open(result.authUrl, "_blank", "width=600,height=700");
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    await disconnectPlatform(platform);
    setLoading(false);
  };

  return (
    <div className="glass rounded-2xl p-4 border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{meta.icon}</span>
        <div>
          <h4 className="font-medium text-sm">{meta.name}</h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            {status === "connected" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            ) : status === "error" ? (
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground capitalize">
              {status === "connected" ? accountName ?? "Connected" : status}
            </span>
          </div>
        </div>
      </div>

      <Button
        size="sm"
        variant={status === "connected" ? "outline" : "default"}
        onClick={status === "connected" ? handleDisconnect : handleConnect}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "connected" ? (
          <>
            <Unplug className="w-3.5 h-3.5 mr-1" /> Disconnect
          </>
        ) : (
          "Connect"
        )}
      </Button>
    </div>
  );
}
