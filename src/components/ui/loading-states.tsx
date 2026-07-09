"use client";

import { motion } from "framer-motion";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-3 border-white/20 border-t-blue-500 rounded-full"
      />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 backdrop-blur-xl">
      <div className="space-y-4">
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="h-8 bg-white/10 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-4">
      <div className="h-6 bg-white/10 rounded w-1/4 animate-pulse" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-4">
      <div className="h-6 bg-white/10 rounded w-1/3 animate-pulse" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 bg-white/10 rounded w-20 animate-pulse" />
            <div className="h-4 bg-white/10 rounded flex-1 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ErrorBoundary({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error("Error caught by boundary:", error);
    return (
      fallback || (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-red-400">
          <p>Something went wrong. Please try refreshing the page.</p>
        </div>
      )
    );
  }
}

export function ErrorState({
  title = "Something went wrong",
  message = "Please try again or contact support",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}

export function EmptyState({
  icon = "📭",
  title = "No items",
  message = "Get started by creating your first item",
  action,
}: {
  icon?: string;
  title?: string;
  message?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
