import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForgotPassword } from '../../hooks/auth/useForgotPassword';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../lib/validations';
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
import { CheckSquareIcon, MailIcon, ArrowLeftIcon } from 'lucide-react';
export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { forgotPassword, loading } = useForgotPassword();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const emailValue = watch('email', '');

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const res = await forgotPassword({ data: values });
    if (res?.success || res?.status) setSent(true);
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
            <CardTitle className="text-2xl">Forgot password?</CardTitle>
            <CardDescription>
              {sent ?
              'Check your email for a reset link' :
              "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ?
            <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <MailIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We sent a reset link to{' '}
                  <strong className="text-foreground">{emailValue}</strong>.
                </p>
                <Button
                variant="outline"
                className="w-full"
                onClick={() => { setSent(false); reset(); }}>

                  Try a different email
                </Button>
              </div> :

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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
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