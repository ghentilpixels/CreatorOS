"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Lightbulb,
  Search,
  FileVideo,
  Image as ImageIcon,
  LineChart,
  Library,
  BookOpen,
  Calendar,
  BarChart,
  Share2,
  Settings,
  Sparkles,
} from "lucide-react";
import { UpgradeToPro } from "@/components/upgrade/upgrade-modal";

const menuItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Ideas", href: "/ideas", icon: Lightbulb },
  { name: "Research", href: "/research", icon: Search },
  { name: "Script Studio", href: "/script-studio", icon: FileVideo },
  { name: "Thumbnail Studio", href: "/thumbnail-studio", icon: ImageIcon },
  { name: "SEO Studio", href: "/seo-studio", icon: LineChart },
  { name: "Prompt Library", href: "/prompt-library", icon: Library },
  { name: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
  { name: "Content Planner", href: "/content-planner", icon: Calendar },
  { name: "Research Studio", href: "/research-studio", icon: Sparkles },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Publish", href: "/publish", icon: Share2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen hidden lg:flex flex-col border-r border-border bg-background/50 backdrop-blur-md sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all">
            C
          </div>
          <span className="font-bold text-xl tracking-tight text-glow">CreatorOS</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-bg"
                    className="absolute inset-0 bg-primary rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary-foreground" : ""}`} />
                <span className="relative z-10 font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <UpgradeToPro>
          <div className="p-4 rounded-xl glass bg-gradient-to-br from-primary/10 to-transparent cursor-pointer group">
            <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-muted-foreground mb-3">Unlock all AI features</p>
            <button className="w-full py-2 bg-foreground text-background text-xs font-bold rounded-lg group-hover:opacity-90 transition-opacity">
              Upgrade Now
            </button>
          </div>
        </UpgradeToPro>
      </div>
    </aside>
  );
}
