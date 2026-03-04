import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useResetPassword } from '../../hooks/auth/useResetPassword';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../../lib/validations';
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
import {
  CheckSquareIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
} from 'lucide-react';
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { resetPassword, loading } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    const res = await resetPassword({
      data: { token, password: values.password, confirmPassword: values.confirmPassword },
    });
    if (res?.success || res?.status) navigate('/login');
  };
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
            <CheckSquareIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">AppName</span>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Reset password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            {!token ?
            <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Invalid or missing reset token.
                </p>
                <Link to="/forgot-password">
                  <Button variant="outline" className="w-full">
                    Request new link
                  </Button>
                </Link>
              </div> :

                        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 chars — 1 uppercase, 1 number"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    className="pr-10"
                    {...register('password')}
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive" role="alert">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Resetting…' : 'Reset password'}
                </Button>
              </form>
            }
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">

                <ArrowLeftIcon className="w-3 h-3" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}