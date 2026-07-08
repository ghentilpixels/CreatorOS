"use client";

import { useState } from "react";
import { User, Mail, Camera, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ProfileSettings() {
  const [name, setName] = useState("Creator");
  const [email, setEmail] = useState("creator@example.com");
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
        <CardTitle className="text-white">Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10 group cursor-pointer">
              <User className="h-10 w-10 text-zinc-500" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <Button type="button" variant="outline" size="sm">
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
              />
              <p className="text-xs text-zinc-500">
                Your email is managed by your authentication provider.
              </p>
            </div>
          </div>

          <div className="flex justify-end max-w-xl">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
