"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, CheckCircle2, Clock, Rocket, FileText } from "lucide-react";
import { getPosts, publishPost } from "../actions";
import { Button } from "@/components/ui/button";
import { PLATFORM_META } from "../services/platforms";

interface Post {
  id: string;
  title: string;
  status: string;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  platforms: Record<string, boolean>;
  error: string | null;
}

interface PostQueueProps {
  refreshKey?: number;
}

export function PostQueue({ refreshKey = 0 }: PostQueueProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    const result = await getPosts();
    if (result.success && "posts" in result) {
      setPosts(result.posts as Post[]);
    } else {
      setError(result.error ?? "Failed to load posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshKey]);

  const handlePublishNow = async (postId: string) => {
    setPublishingId(postId);
    const result = await publishPost(postId);
    setPublishingId(null);
    if (result.success) {
      fetchPosts();
    } else {
      setError(result.error ?? "Publish failed");
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "scheduled":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "publishing":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="glass rounded-2xl p-5 border-white/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base">Publishing Queue</h3>
          <p className="text-xs text-muted-foreground">Recent and scheduled posts</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchPosts} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {posts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 text-muted-foreground text-sm"
            >
              <Rocket className="w-8 h-8 mx-auto mb-3 opacity-30" />
              No posts yet. Create your first publish.
            </motion.div>
          )}

          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-white/[0.03] border border-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {statusIcon(post.status)}
                    <h4 className="font-medium text-sm truncate">{post.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.status === "scheduled" && post.scheduledAt
                      ? `Scheduled for ${new Date(post.scheduledAt).toLocaleString()}`
                      : post.status === "published" && post.publishedAt
                        ? `Published ${new Date(post.publishedAt).toLocaleString()}`
                        : post.status}
                  </p>
                  {post.error && <p className="text-xs text-red-500 mt-1">{post.error}</p>}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Object.keys(post.platforms ?? {}).map((p) => (
                      <span key={p} className="text-base" title={PLATFORM_META[p as keyof typeof PLATFORM_META]?.name}>
                        {PLATFORM_META[p as keyof typeof PLATFORM_META]?.icon}
                      </span>
                    ))}
                  </div>
                  {post.status === "draft" && (
                    <Button
                      size="xs"
                      onClick={() => handlePublishNow(post.id)}
                      disabled={publishingId === post.id}
                    >
                      {publishingId === post.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        "Publish"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
