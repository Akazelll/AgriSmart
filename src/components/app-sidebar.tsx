import {
  Cloud,
  Home,
  Landmark,
  Rat,
  TrendingUpDown,
  User,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { signOut } from "@/auth";

const items = [
  {
    title: "Home",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Keuangan",
    url: "keuangan",
    icon: Landmark,
  },
  {
    title: "Penyakit",
    url: "penyakit",
    icon: Rat,
  },
  {
    title: "Prediction",
    url: "prediction",
    icon: TrendingUpDown,
  },
  {
    title: "Cuaca",
    url: "weather",
    icon: Cloud,
  },
  {
    title: "Profil",
    url: "profile",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='text-lg text-dark'>
            AgriSmart
          </SidebarGroupLabel>
          <SidebarGroupContent className='py-4'>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className='text-2md text-dark'>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <SidebarMenuButton
                type='submit'
                className='text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30'
              >
                <LogOut />
                <span className='text-base font-medium'>Keluar</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
