"use client";

import { useState, useEffect } from "react";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getUserProfile, updateProfile } from "../actions";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const setAuthUser = useAuthStore((state) => state.login);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserProfile();
        if (result.success && "user" in result) {
          setName(result.user.name || "");
          setEmail(result.user.email);
          setAvatarUrl(result.user.avatarUrl || null);
          
          setAuthUser({
            id: result.user.id,
            name: result.user.name || "Creator",
            email: result.user.email,
            avatarUrl: result.user.avatarUrl || undefined
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [setAuthUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const result = await updateProfile({ name });
    
    if (result.success && "user" in result) {
      toast.success("Profile updated successfully!");
      setAuthUser({
        id: result.user.id,
        name: result.user.name || "Creator",
        email: result.user.email,
        avatarUrl: result.user.avatarUrl || undefined
      });
    } else {
      toast.error(result.error || "Failed to update profile");
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-white/5">
      <CardHeader>
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 group cursor-pointer">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-zinc-500" />
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <Button type="button" variant="outline" size="sm" className="bg-white/5 hover:bg-white/10 border-white/10">
                Change avatar
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Display Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-black/40 border-white/10"
              />
              <p className="text-xs text-zinc-500">
                Your name may appear around CreatorOS where you contribute or are mentioned.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-black/20 border-white/5 text-muted-foreground"
              />
              <p className="text-xs text-zinc-500">
                Your email is managed by your authentication provider.
              </p>
            </div>
          </div>

          <div className="flex justify-end max-w-xl">
            <Button type="submit" disabled={isSaving} className="bg-white text-black hover:bg-white/90">
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
