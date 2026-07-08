"use client";

import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Subtle background glow effect */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-hide relative z-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
