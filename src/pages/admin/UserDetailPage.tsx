/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserDetail } from '../../hooks/admin/useUserDetail';
import type { User, UpdateUserPayload } from '../../types/user.types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle } from
'../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
'../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { ConfirmDialog } from '../../components/shared/ConfirmDialog';
import {
  ArrowLeftIcon,
  Loader2Icon,
  SaveIcon,
  UserIcon,
  CalendarIcon,
  MailIcon } from
'lucide-react';
import { cn } from '../../lib/utils';
const roleColors: Record<string, string> = {
  ADMIN: 'bg-primary text-primary-foreground',
  MODERATOR: 'bg-secondary text-secondary-foreground',
  USER: 'bg-muted text-muted-foreground'
};
export function UserDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<
    UpdateUserPayload & {
      role?: User['role'];
      isActive?: boolean;
    }>(
    {});
  const [dirty, setDirty] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const { getUser, loading, updateUser, saving } = useUserDetail(id);
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const res = await getUser();
      if (res?.data) {
        const u = (res.data as { user?: User })?.user || (res.data as User);
        setUser(u);
        setForm({
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: u.isActive
        });
      }
    };
    load();
  }, [id]);
  const handleChange = <K extends keyof typeof form,>(
  key: K,
  value: (typeof form)[K]) =>
  {
    setForm((p) => ({
      ...p,
      [key]: value
    }));
    setDirty(true);
  };
  const handleSave = async () => {
    const res = await updateUser({
      data: form
    });
    if (res?.success || res?.status) {
      setDirty(false);
      const u = (res.data as { user?: User })?.user;
      if (u) setUser(u);
    }
  };
  const handleToggleActive = async () => {
    const newActive = !form.isActive;
    handleChange('isActive', newActive);
    setDeactivateOpen(false);
    const res = await updateUser({
      data: {
        ...form,
        isActive: newActive
      }
    });
    if (res?.success || res?.status) {
      setDirty(false);
      const u = (res.data as { user?: User })?.user;
      if (u) setUser(u);
    }
  };
  if (loading)
  return (
    <div className="flex items-center justify-center py-24">
        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>);

  if (!user)
  return (
    <div className="text-center py-24">
        <p className="text-muted-foreground">User not found.</p>
        <Button variant="link" onClick={() => navigate('/admin/users')}>
          Back to users
        </Button>
      </div>);

  return (
    <div className="max-w-2xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
        onClick={() => navigate('/admin/users')}>

        <ArrowLeftIcon className="w-4 h-4" />
        Back to Users
      </Button>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              {user.avatarUrl ?
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover" /> :


              <UserIcon className="w-7 h-7 text-muted-foreground" />
              }
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                {user.name}
              </h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MailIcon className="w-3.5 h-3.5" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    roleColors[user.role] || roleColors.USER
                  )}>

                  {user.role}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                    user.isActive ?
                    'bg-muted text-foreground' :
                    'bg-destructive/10 text-destructive'
                  )}>

                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
                {user.emailVerified &&
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                    Verified
                  </span>
                }
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <CalendarIcon className="w-3 h-3" />
                Joined{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)} />

          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email || ''}
              onChange={(e) => handleChange('email', e.target.value)} />

          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={form.role}
              onValueChange={(val) => handleChange('role', val as User['role'])}>

              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="isActive" className="text-sm font-medium">
                Account Active
              </Label>
              <p className="text-xs text-muted-foreground">
                Inactive users cannot log in
              </p>
            </div>
            <Switch
              id="isActive"
              checked={form.isActive ?? true}
              onCheckedChange={(checked: any) => {
                if (!checked) setDeactivateOpen(true);else
                handleChange('isActive', true);
              }} />

          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving || !dirty}
              className="gap-2">

              <SaveIcon className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate User"
        description={`Are you sure you want to deactivate ${user.name}? They will no longer be able to log in.`}
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={handleToggleActive} />

    </div>);

}