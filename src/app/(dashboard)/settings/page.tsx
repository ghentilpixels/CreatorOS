"use client";

import { Settings as SettingsIcon, Building2, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/features/settings/components/ProfileSettings";
import { AppearanceSettings } from "@/features/settings/components/AppearanceSettings";
import { IntegrationsSettings } from "@/features/settings/components/IntegrationsSettings";
import { WorkspaceSettings } from "@/features/workspaces/components/WorkspaceSettings";
import { BillingSettings } from "@/features/billing/components/BillingSettings";

const tabs = [
  { value: "profile", label: "Profile", icon: null },
  { value: "workspace", label: "Workspace", icon: Building2 },
  { value: "billing", label: "Billing", icon: CreditCard },
  { value: "appearance", label: "Appearance", icon: null },
  { value: "integrations", label: "Integrations", icon: null },
];

export default function SettingsPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-black min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          </div>
          <p className="text-zinc-400">
            Manage your account, workspace, billing, and application preferences.
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList variant="line" className="w-full md:w-auto bg-transparent p-0 gap-4 h-auto flex-wrap">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-b-2 border-transparent data-[active]:border-purple-500 data-[active]:text-purple-400 data-[active]:shadow-none px-0 py-2 text-sm font-medium text-zinc-400 hover:text-white"
              >
                {tab.icon && <tab.icon className="w-4 h-4 mr-1.5" />}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="workspace" className="mt-0">
              <WorkspaceSettings />
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <BillingSettings />
            </TabsContent>
            <TabsContent value="appearance" className="mt-0">
              <AppearanceSettings />
            </TabsContent>
            <TabsContent value="integrations" className="mt-0">
              <IntegrationsSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
