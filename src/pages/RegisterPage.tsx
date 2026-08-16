import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, ArrowRight, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/components/Toast';
import { Button } from '@/components/ui/Button';
import { Input, Select, Field } from '@/components/ui/Input';

export function RegisterPage() {
  const { signUp } = useAuth();
  const { theme, toggle } = useTheme();
  const { show } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    college: '',
    department: '',
    year: '1st Year',
  });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      show('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    const { error } = await signUp(form);
    setLoading(false);
    if (error) {
      show(error, 'error');
    } else {
      show('Account created! Welcome to CampusAI.', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 dark:bg-slate-950">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Join CampusAI and start studying smarter.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Field label="Full Name">
              <Input
                required
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="you@college.edu"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                required
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="At least 6 characters"
              />
            </Field>
            <Field label="College">
              <Input
                required
                value={form.college}
                onChange={(e) => update('college', e.target.value)}
                placeholder="State University"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Department">
                <Input
                  required
                  value={form.department}
                  onChange={(e) => update('department', e.target.value)}
                  placeholder="Computer Science"
                />
              </Field>
              <Field label="Year">
                <Select value={form.year} onChange={(e) => update('year', e.target.value)}>
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                </Select>
              </Field>
            </div>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Create account <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
