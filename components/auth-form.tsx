'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/app/login/actions"
import { useState } from "react"

type AuthMode = 'login' | 'signup';

export function AuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmail(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to sign in');
      setLoading(false);
    }
  };

  const handleSignUp = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await signUpWithEmail(formData);
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else if (result?.success) {
        setSuccess(result.message || 'Account created successfully!');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create account');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null);
    setSuccess(null);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="inline-flex rounded-lg border p-1 bg-muted/50">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
                  mode === 'login'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
                  mode === 'signup'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sign Up
              </button>
            </div>
          </div>
          <CardTitle className="text-xl">
            {mode === 'login' ? 'Welcome to Vitalia' : 'Create your account'}
          </CardTitle>
          <CardDescription>
            {mode === 'login'
              ? 'Login with Google or your email account'
              : 'Sign up with Google or create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-hidden">
            {/* Login Form */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                mode === 'login'
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
              )}
            >
              <form action={handleEmailSignIn}>
                <FieldGroup>
                  {error && mode === 'login' && (
                    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {error}
                    </div>
                  )}
                  <Field>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      {loading ? 'Signing in...' : 'Login with Google'}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="login-password">Password</FieldLabel>
                      <a
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Signing in...' : 'Login'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>

            {/* Signup Form */}
            <div
              className={cn(
                "transition-all duration-500 ease-in-out",
                mode === 'signup'
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
              )}
            >
              <form action={handleSignUp}>
                <FieldGroup>
                  {error && mode === 'signup' && (
                    <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-500/15 text-green-700 dark:text-green-400 px-4 py-3 rounded-md text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                      {success}
                    </div>
                  )}
                  <Field>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      {loading ? 'Signing up...' : 'Sign up with Google'}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <Field>
                    <FieldLabel htmlFor="signup-name">Full Name</FieldLabel>
                    <Input
                      id="signup-name"
                      name="fullName"
                      type="text"
                      placeholder="John Doe"
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      disabled={loading}
                    />
                  </Field>
                  <Field>
                    <Field className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          required
                          disabled={loading}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="signup-confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="signup-confirm-password"
                          name="confirmPassword"
                          type="password"
                          required
                          disabled={loading}
                        />
                      </Field>
                    </Field>
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="underline">Terms of Service</a>{" "}
        and <a href="/privacy" className="underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
