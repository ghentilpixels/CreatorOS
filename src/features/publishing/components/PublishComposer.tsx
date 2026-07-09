"use client";

import { useState } from "react";
import { Send, Calendar, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformSelector } from "./PlatformSelector";
import { createPost, publishPost } from "../actions";
import type { IntegrationPlatform } from "@/lib/types";
import { toast } from "sonner";

interface PublishComposerProps {
  onPublished?: () => void;
}

export function PublishComposer({ onPublished }: PublishComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [platforms, setPlatforms] = useState<Record<string, boolean>>({
    YOUTUBE: false,
    TIKTOK: false,
    INSTAGRAM: false,
    LINKEDIN: false,
  });
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePlatform = (platform: IntegrationPlatform, enabled: boolean) => {
    setPlatforms((prev) => ({ ...prev, [platform]: enabled }));
  };

  const handlePublish = async (schedule = false) => {
    setError(null);
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!Object.values(platforms).some(Boolean)) {
      setError("Select at least one platform.");
      return;
    }

    setLoading(true);

    const createResult = await createPost({
      title,
      description,
      mediaUrl,
      platforms,
      scheduledAt: schedule && scheduledAt ? new Date(scheduledAt) : undefined,
    });

    if (!createResult.success || !("postId" in createResult)) {
      setLoading(false);
      setError(createResult.error ?? "Could not create post.");
      return;
    }

    if (!schedule) {
      const publishResult = await publishPost(createResult.postId);
      setLoading(false);
      if (publishResult.success) {
        toast.success("Content published successfully");
        reset();
        onPublished?.();
      } else {
        setError(publishResult.error ?? "Publishing failed.");
      }
    } else {
      setLoading(false);
      toast.success("Content scheduled");
      reset();
      onPublished?.();
    }
  };

  const reset = () => {
    setTitle("");
    setDescription("");
    setMediaUrl("");
    setPlatforms({ YOUTUBE: false, TIKTOK: false, INSTAGRAM: false, LINKEDIN: false });
    setScheduledAt("");
  };

  return (
    <div className="glass rounded-2xl p-5 border-white/5 space-y-5">
      <div>
        <h3 className="font-semibold text-base mb-1">Create Post</h3>
        <p className="text-xs text-muted-foreground">Compose once, publish everywhere.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description / Caption</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a caption, description, or script excerpt..."
          className="w-full min-h-[100px] bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mediaUrl">Media URL</Label>
        <Input
          id="mediaUrl"
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="https://cdn.example.com/video.mp4"
        />
      </div>

      <div className="space-y-2">
        <Label>Platforms</Label>
        <PlatformSelector selected={platforms} onChange={togglePlatform} disabled={loading} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="schedule" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Schedule (optional)
        </Label>
        <Input
          id="schedule"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          className="flex-1"
          disabled={loading}
          onClick={() => handlePublish(false)}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="ml-2">Publish Now</span>
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          disabled={loading || !scheduledAt}
          onClick={() => handlePublish(true)}
        >
          <Calendar className="w-4 h-4" />
          <span className="ml-2">Schedule</span>
        </Button>
      </div>
    </div>
  );
}
