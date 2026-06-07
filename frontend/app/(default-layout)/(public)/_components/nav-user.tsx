'use client'

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  EllipsisVertical,
  CreditCard,
  LogIn,
  LogOut
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/shared/components/ui/sidebar'
import type { Session } from 'next-auth'
import { getSession } from '@/shared/actions/auth'
import { useSession } from '@/shared/components/provider/session'
import Link from 'next/link'
import Form from 'next/form'
import { Button } from '@/shared/components/ui/button'
import { signOutWithForm } from '@/shared/actions/auth'

// NextAuth를 사용한다면 보통은 Session의 user 를 그대로 넘겨서 사용
type User = {
  name?: string | null
  email?: string | null
  image?: string | null
} | null

// NextAuth의 기본 타입
/* session.user?.name
session.user?.email
session.user?.image */

/* export function NavUser({
  user
}: {
  user?: {
    name: string
    email: string
    image: string
  }
}) { */
export function NavUser({ user }: { user?: Session['user'] }) {
  const { isMobile } = useSidebar()
  // const session = await getSession()
  // const session = useSession()   // TODO: props drilling 필요없지??

  return !user ? (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Link href="/signin">
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <LogIn className="size-4" />
            </div> */}
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                <LogIn className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Login</span>
              <span className="text-muted-foreground truncate text-xs">
                Sign in to your account
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  ) : (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={user.image}
                  alt={user.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.image}
                    alt={user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem onClick={() => signOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem> */}
            <DropdownMenuItem asChild>
              <Form
                action={signOutWithForm}
                // replace
                // scroll={false}
                className="w-full">
                <Button
                  variant="ghost"
                  // form="form-snack"
                  className="h-auto w-full justify-start gap-2 p-0 font-normal hover:bg-transparent focus:bg-transparent">
                  <LogOut />
                  Log out
                </Button>
              </Form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
