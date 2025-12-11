"use client";

import * as React from "react";
import {
  LayoutDashboard,
  CloudSun,
  Sprout,
  Wallet,
  ScanLine,
  User,
  LogOut,
  Leaf,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuGroups = [
  {
    label: "Utama",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Scan Penyakit",
        url: "/prediction",
        icon: ScanLine,
      },
      {
        title: "Cuaca & Lahan",
        url: "/weather",
        icon: CloudSun,
      },
    ],
  },
  {
    label: "Manajemen",
    items: [
      {
        title: "Riwayat",
        url: "/penyakit",
        icon: Sprout,
      },
      {
        title: "Keuangan",
        url: "/keuangan",
        icon: Wallet,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible='offcanvas' variant='floating' {...props}>
      <SidebarHeader>
        <div className='flex items-center justify-between w-full'>
          <SidebarMenu className='flex-1'>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild>
                <Link href='/dashboard'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm'>
                    <Leaf className='size-4' />
                  </div>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-bold text-emerald-950'>
                      AgriSmart
                    </span>
                    <span className='truncate text-xs text-stone-500'>
                      Sobat Petani
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <Button
            variant='ghost'
            size='icon'
            className='md:hidden text-stone-500 hover:text-stone-900 ml-2'
            onClick={() => setOpenMobile(false)}
          >
            <X className='size-5' />
            <span className='sr-only'>Tutup Menu</span>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(`${item.url}/`);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        onClick={() => setOpenMobile(false)}
                        className='data-[active=true]:bg-emerald-50 data-[active=true]:text-emerald-700 transition-all hover:translate-x-1'
                      >
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip='Profil Saya'
              isActive={pathname === "/profile"}
              onClick={() => setOpenMobile(false)}
            >
              <Link href='/profile'>
                <User />
                <span>Profil Saya</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarSeparator className='my-1 opacity-50' />

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => signOut({ callbackUrl: "/login" })}
              className='text-red-600 hover:bg-red-50 hover:text-red-700'
              tooltip='Keluar Aplikasi'
            >
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
