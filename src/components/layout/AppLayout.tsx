import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import useFetch from '../../hooks/useFetch';
import { ENDPOINTS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import {
  LayoutDashboardIcon,
  CheckSquareIcon,
  UsersIcon,
  LogOutIcon,
  MenuIcon,
  ChevronDownIcon } from
'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger } from
'../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
const navItems = [
{
  to: '/dashboard',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
},
{
  to: '/todos',
  label: 'Todos',
  icon: CheckSquareIcon
}];

const adminNavItems = [
{
  to: '/admin/users',
  label: 'Users',
  icon: UsersIcon
}];

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const { fetchData: logout, loading: loggingOut } = useFetch(
    ENDPOINTS.LOGOUT,
    {
      method: 'POST',
      silent: true
    }
  );
  const handleLogout = async () => {
    await logout();
    clearAuth();
    navigate('/login');
  };
  const initials = user?.name ?
  user.name.
  split(' ').
  map((n) => n[0]).
  join('').
  toUpperCase().
  slice(0, 2) :
  'U';
  const SidebarContent = () =>
  <div className="flex flex-col h-full ">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border h-[74px]">
        <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center ">
          <CheckSquareIcon className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-foreground text-lg">ToDo App</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Main
        </p>
        {navItems.map(({ to, label, icon: Icon }) =>
      <NavLink
        key={to}
        to={to}
        onClick={() => setSidebarOpen(false)}
        className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
          isActive ?
          'bg-primary text-primary-foreground' :
          'text-foreground hover:bg-accent hover:text-accent-foreground'
        )
        }>

            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
      )}

        {user?.role === 'ADMIN' &&
      <>
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mt-4 mb-2">
              Admin
            </p>
            {adminNavItems.map(({ to, label, icon: Icon }) =>
        <NavLink
          key={to}
          to={to}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
          cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isActive ?
            'bg-primary text-primary-foreground' :
            'text-foreground hover:bg-accent hover:text-accent-foreground'
          )
          }>

                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
        )}
          </>
      }
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start gap-2 mt-1 text-muted-foreground hover:text-destructive"
        onClick={handleLogout}
        disabled={loggingOut}>

          <LogOutIcon className="w-4 h-4" />
          {loggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen &&
      <div className="fixed inset-0 z-40 md:hidden">
          <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setSidebarOpen(false)} />

          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      }

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 flex-shrink-0 md:h-[74px]">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar">

            <MenuIcon className="w-5 h-5" />
          </Button>
          <div className="hidden md:block" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-9 px-2">

                <Avatar className="w-7 h-7">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:block">
                  {user?.name}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-normal">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={handleLogout}
                disabled={loggingOut}>

                <LogOutIcon className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>);

}