"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { motion } from "framer-motion";
import { PlaySquare, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "OAuth sign-in failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { createClient } = await import("@/lib/supabase/client");
      const { error } = await createClient().auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side: Dynamic Visual / Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-zinc-950 border-r border-white/5">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-600/30 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        </div>

        {/* Content over background */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-xl backdrop-blur-md border border-primary/20">
            <PlaySquare className="w-8 h-8 text-primary" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">CreatorOS</span>
        </div>

        <div className="relative z-10 max-w-lg mt-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-semibold text-white leading-tight mb-6">
              Empower your creative workflow.
            </h2>
            <p className="text-lg text-zinc-400">
              Join thousands of creators who use CreatorOS to streamline their ideas, scripts, and content strategy in one unified workspace.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
              <p className="text-zinc-400">Sign in to continue to your workspace.</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="creator@example.com" 
                    className="pl-10 h-12 bg-zinc-900/50 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl" 
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-300">Password</Label>
                  <Link href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 bg-zinc-900/50 border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary transition-all rounded-xl" 
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl text-primary-foreground font-medium bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Or continue with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-12 bg-transparent border-white/10 hover:bg-white/5 text-zinc-300 rounded-xl transition-all" onClick={() => handleOAuthSignIn("github")}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.5 5.5 0 0 0-1.5-3.8 5.1 5.1 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0c-2.7-1.8-3.9-1.4-3.9-1.4a5.1 5.1 0 0 0-.1 3.8A5.5 5.5 0 0 0 2 8.5c0 5.23 3 6.42 6 6.76A4.8 4.8 0 0 0 7 18.5v3.5" />
                  <path d="M9 19c-4.3 1.4-5.3-2-6-2" />
                </svg>
                Github
              </Button>
              <Button variant="outline" className="h-12 bg-transparent border-white/10 hover:bg-white/5 text-zinc-300 rounded-xl transition-all" onClick={() => handleOAuthSignIn("google")}>
                <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
            </div>
            
            <p className="mt-8 text-center text-sm text-zinc-400">
              Don't have an account? <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">Sign up for free</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
