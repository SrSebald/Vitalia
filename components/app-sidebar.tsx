"use client"

import * as React from "react"
import {
  Dumbbell,
  Activity,
  Apple,
  Camera,
  Smile,
  BarChart3,
  Settings2,
  LifeBuoy,
  Send,
  GalleryVerticalEnd,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const getData = (user: any) => ({
  user: {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    avatar: user?.user_metadata?.avatar_url || '',
  },
  navMain: [
    {
      title: "Workouts",
      url: "/dashboard/workouts",
      icon: Dumbbell,
      isActive: true,
      items: [
        {
          title: "My Workouts",
          url: "/dashboard/workouts",
        },
        {
          title: "Exercises",
          url: "/dashboard/exercises",
        },
        {
          title: "Log Workout",
          url: "/dashboard/workouts/new",
        },
      ],
    },
    {
      title: "Nutrition",
      url: "/dashboard/nutrition",
      icon: Apple,
      items: [
        {
          title: "Food Log",
          url: "/dashboard/nutrition",
        },
        {
          title: "Meal Plans",
          url: "/dashboard/nutrition/plans",
        },
      ],
    },
    {
      title: "Progress",
      url: "/dashboard/progress",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/dashboard/progress",
        },
        {
          title: "Photos",
          url: "/dashboard/progress/photos",
        },
        {
          title: "Mood Tracker",
          url: "/dashboard/progress/mood",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Preferences",
          url: "/dashboard/settings/preferences",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  quickActions: [
    {
      name: "Today's Activity",
      url: "/dashboard",
      icon: Activity,
    },
    {
      name: "Progress Photos",
      url: "/dashboard/progress/photos",
      icon: Camera,
    },
    {
      name: "Mood Check-in",
      url: "/dashboard/progress/mood",
      icon: Smile,
    },
  ],
})

export function AppSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar> & { user: any }) {
  const data = getData(user)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Vitalia</span>
                  <span className="truncate text-xs">Fitness Tracker</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.quickActions} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
