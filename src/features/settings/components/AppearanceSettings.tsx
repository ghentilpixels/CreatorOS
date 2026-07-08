"use client";

import { Monitor, Sun, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AppearanceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-zinc-400 -mt-2">
            Customize how CreatorOS looks on your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3 border-purple-500 bg-white/5"
            >
              <Monitor className="h-8 w-8 text-white" />
              <span className="text-sm font-medium text-white">System</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3"
            >
              <Sun className="h-8 w-8 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Light</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center justify-center p-6 h-auto gap-3"
            >
              <Moon className="h-8 w-8 text-zinc-400" />
              <span className="text-sm font-medium text-zinc-300">Dark</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
