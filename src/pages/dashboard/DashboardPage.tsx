/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useDashboard } from '../../hooks/dashboard/useDashboard';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/card';
import {
  CheckSquareIcon,
  CircleIcon,
  ListTodoIcon,
  UserIcon } from
'lucide-react';
import type { TodosResponse } from '../../types/todo.types';
interface Stats {
  total: number;
  completed: number;
  pending: number;
}
export function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    total: 0,
    completed: 0,
    pending: 0
  });
  const { getTodos, loading } = useDashboard();
  useEffect(() => {
    const load = async () => {
      const res = await getTodos({
        data: {
          page: 1,
          limit: 100
        }
      });
      if (res?.data) {
        const todos = (res.data as TodosResponse).todos || [];
        setStats({
          total: todos.length,
          completed: todos.filter((t) => t.isDone).length,
          pending: todos.filter((t) => !t.isDone).length
        });
      }
    };
    load();
  }, []);
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          {greeting()}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your todos today.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Todos
            </CardTitle>
            <ListTodoIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loading ? '—' : stats.total}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All your todos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckSquareIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loading ? '—' : stats.completed}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.total > 0 ?
              `${Math.round(stats.completed / stats.total * 100)}% completion rate` :
              'No todos yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <CircleIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {loading ? '—' : stats.pending}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Still in progress
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <UserIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                  {user?.role}
                </span>
                {user?.emailVerified &&
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    Verified
                  </span>
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}