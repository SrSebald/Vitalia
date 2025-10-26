import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Welcome back, {user?.user_metadata?.full_name || 'User'}!</h3>
              <p className="text-sm text-muted-foreground">
                Ready to track your fitness journey today?
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Today's Progress</h3>
              <p className="text-sm text-muted-foreground">
                Start logging your workouts and meals
              </p>
            </div>
            <div className="bg-card border rounded-xl p-6">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <p className="text-sm text-muted-foreground">
                Log a workout or track your nutrition
              </p>
            </div>
          </div>
          <div className="bg-card border min-h-[50vh] flex-1 rounded-xl p-6 md:min-h-min">
            <h2 className="text-2xl font-bold mb-4">Your Activity Overview</h2>
            <p className="text-muted-foreground">Start tracking your fitness data to see your progress here.</p>
          </div>
        </div>
    </>
  )
}
