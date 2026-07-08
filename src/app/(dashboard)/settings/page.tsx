"use client";

import { useState } from "react";
import { User, Monitor, Key, Settings as SettingsIcon } from "lucide-react";
import { ProfileSettings } from "@/features/settings/components/ProfileSettings";
import { AppearanceSettings } from "@/features/settings/components/AppearanceSettings";
import { IntegrationsSettings } from "@/features/settings/components/IntegrationsSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "appearance", label: "Appearance", icon: Monitor },
    { id: "integrations", label: "Integrations", icon: Key },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          </div>
          <p className="text-zinc-400">
            Manage your account settings and application preferences.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-purple-500/10 text-purple-400"
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <tab.icon className={`h-4 w-4 ${isActive ? "text-purple-400" : "text-zinc-500"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 bg-zinc-900/30 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
            {activeTab === "profile" && <ProfileSettings />}
            {activeTab === "appearance" && <AppearanceSettings />}
            {activeTab === "integrations" && <IntegrationsSettings />}
          </main>
        </div>
      </div>
    </div>
  );
}
