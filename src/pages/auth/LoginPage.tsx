/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '../../store/authStore';
import { useLogin } from '../../hooks/auth/useLogin';
import { loginSchema, type LoginFormValues } from '../../lib/validations';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { CheckSquareIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import type { User } from '../../types/user.types';
import type { AuthTokens } from '../../types/auth.types';
export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (values: LoginFormValues) => {
    const res = await login({ data: values });
    // normalize response shapes: { data: { accessToken: string, user } } or { accessToken, user } etc.
    if (!res) return;
    const user = (res?.data as { user?: User })?.user || (res as unknown as { user?: User })?.user;
    let accessToken: string | undefined = undefined;
    accessToken = (res as any)?.data?.accessToken || (res as any)?.accessToken || (res as any)?.token || (res as any)?.data?.token;
    if (accessToken && typeof accessToken === 'object') {
      accessToken = (accessToken as any).accessToken || (accessToken as any).token || undefined;
    }
    if (user && accessToken) {
      const tokens: AuthTokens = { accessToken };
      setAuth(user, tokens);
      navigate('/dashboard');
    }
  };
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <CheckSquareIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">ToDo App</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors">

                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                    className="pr-10"
                    {...register('password')}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >

                    {showPassword ?
                      <EyeOffIcon className="w-4 h-4" /> :

                      <EyeIcon className="w-4 h-4" />
                    }
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-foreground font-medium hover:underline">

                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>);

}