import {
  Calendar,
  Cloud,
  Home,
  Inbox,
  Landmark,
  Rat,
  Search,
  Settings,
  TrendingUpDown,
  User,
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
} from "@/components/ui/sidebar";

// Menu items.
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
    url: "profil",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
