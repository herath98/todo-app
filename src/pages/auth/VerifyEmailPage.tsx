import React, { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../../hooks/auth/useVerifyEmail';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle } from
'../../components/ui/card';
import { CheckSquareIcon, MailCheckIcon, CheckCircleIcon } from 'lucide-react';
export function VerifyEmailPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const emailFromState =
  (
  location.state as {
    email?: string;
  })?.
  email || '';
  const token = searchParams.get('token') || '';
  const [verified, setVerified] = useState(false);
  const { verifyEmail, verifying, resendVerification: resend, resending } = useVerifyEmail();
  const handleVerify = async () => {
    const res = await verifyEmail({
      data: {
        token
      }
    });
    if (res?.success || res?.status) setVerified(true);
  };
  const handleResend = async () => {
    await resend({
      data: {
        email: emailFromState
      }
    });
  };
  if (verified) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-7 h-7 text-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Email verified!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your email has been verified successfully.
                </p>
              </div>
              <Link to="/login">
                <Button className="w-full">Continue to login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>);

  }
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
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
              <MailCheckIcon className="w-6 h-6 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              {token ?
              'Click below to verify your email.' :
              emailFromState ?
              `We sent a verification email to ${emailFromState}.` :
              'Check your email for a verification link.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {token &&
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={verifying}>

                {verifying ? 'Verifying...' : 'Verify email'}
              </Button>
            }
            {emailFromState &&
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={resending}>

                {resending ? 'Sending...' : 'Resend verification email'}
              </Button>
            }
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">

                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>);

}