"use client";

import { Bell, Search, Menu, User as UserIcon, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { WorkspaceSwitcher } from "@/features/workspaces/components/WorkspaceSwitcher";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

export function TopNav() {
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 lg:hidden">
        <button className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg">CreatorOS</span>
      </div>

      <div className="hidden lg:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search projects, ideas, or files..." 
            className="w-full pl-9 pr-4 py-2 text-sm bg-muted/50 border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <WorkspaceSwitcher />
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 pl-4 border-l border-border outline-none hover:opacity-80 transition-opacity">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.name || "Guest"}</p>
              <p className="text-xs text-muted-foreground">{user?.email || "Sign in"}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-primary/50 p-[2px]">
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-4 h-4 text-foreground" />
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
