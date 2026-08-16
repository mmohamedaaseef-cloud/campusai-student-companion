import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import { Input, Field } from '@/components/ui/Input';

export function LoginPage() {
  const { signIn } = useAuth();
  const { theme, toggle } = useTheme();
  const { show } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      show(error, 'error');
    } else {
      show('Welcome back!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="absolute right-4 top-4">
        <button
          onClick={toggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sm">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Campus<span className="text-sky-500">AI</span>
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Sign in to your account to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="pl-10"
                />
              </div>
            </Field>
            <Field label="Password">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </Field>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
