/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../../hooks/admin/useUsers';
import type { User } from '../../types/user.types';
import { DataTable, type Column } from '../../components/shared/DataTable';
import { EmptyState } from '../../components/shared/EmptyState';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { UsersIcon, SearchIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
const roleColors: Record<string, string> = {
  ADMIN: 'bg-primary text-primary-foreground',
  MODERATOR: 'bg-secondary text-secondary-foreground',
  USER: 'bg-muted text-muted-foreground'
};
export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { getUsers, loading } = useUsers();
  useEffect(() => {
    const load = async () => {
      const res = await getUsers({
        data: {
          page: 1,
          limit: 50
        }
      });
      // API may return either { data: User[] } or { data: { users: User[] } }
      if (res?.data) {
        const payload = res.data as unknown;
        if (Array.isArray(payload)) setUsers(payload as User[]);else if (
        typeof payload === 'object' && payload !== null &&
        Array.isArray((payload as any).users))
        setUsers((payload as any).users as User[]);
        else setUsers([]);
      }
    };
    load();
  }, []);
  const filtered = users.filter(
    (u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  const columns: Column<User>[] = [
  {
    key: 'name',
    header: 'Name',
    cell: (user) =>
    <div>
          <p className="font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>

  },
  {
    key: 'role',
    header: 'Role',
    cell: (user) =>
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        roleColors[user.role] || roleColors.USER
      )}>

          {user.role}
        </span>

  },
  {
    key: 'status',
    header: 'Status',
    cell: (user) =>
    <div className="flex items-center gap-2">
          <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
          user.isActive ?
          'bg-muted text-foreground' :
          'bg-destructive/10 text-destructive'
        )}>

            {user.isActive ? 'Active' : 'Inactive'}
          </span>
            {user.isEmailVerified &&
          <span className="text-xs text-muted-foreground">Verified</span>
          }
        </div>

  },
  {
    key: 'createdAt',
    header: 'Joined',
    cell: (user) =>
    <span className="text-sm text-muted-foreground">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>

  },
  {
    key: 'actions',
    header: '',
    cell: (user) =>
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/admin/users/${user.id}`);
      }}>

          View
        </Button>,

    className: 'text-right'
  }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {users.length} total users
          </p>
        </div>
      </div>
      <div className="relative max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9" />

      </div>
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        rowKey={(u) => u.id}
        onRowClick={(u) => navigate(`/admin/users/${u.id}`)}
        emptyState={
        <EmptyState
          icon={<UsersIcon className="w-6 h-6 text-muted-foreground" />}
          title="No users found"
          description={
          search ?
          'Try a different search term.' :
          'No users have registered yet.'
          } />

        } />

    </div>);

}