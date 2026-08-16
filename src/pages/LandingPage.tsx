import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  Brain,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  NotebookPen,
  ListTodo,
  Calendar,
  ArrowRight,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

export function LandingPage() {
  const { theme, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Campus<span className="text-sky-500">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Features</a>
            <a href="#subjects" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Subjects</a>
            <a href="#ai" className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">AI Assistant</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register" className="hidden sm:block">
              <Button size="sm">Get Started</Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 px-4 py-4 dark:border-slate-800 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">Features</a>
              <a href="#subjects" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">Subjects</a>
              <a href="#ai" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-600 dark:text-slate-300">AI Assistant</a>
              <div className="flex gap-2 pt-2">
                <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
                <Link to="/register" className="flex-1"><Button size="sm" className="w-full">Get Started</Button></Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-500/10" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
              <Sparkles className="h-4 w-4" />
              Your AI Student Companion
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Study smarter with{' '}
              <span className="bg-gradient-to-r from-sky-500 to-cyan-400 bg-clip-text text-transparent">CampusAI</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              CampusAI helps college students study smarter — get instant explanations, generate
              study notes, organize subjects, and manage tasks all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-300/30 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-800 dark:to-slate-900">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[
                    { icon: Brain, label: 'AI Assistant', color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950' },
                    { icon: NotebookPen, label: 'Smart Notes', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950' },
                    { icon: ListTodo, label: 'Task Manager', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950' },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.bg}`}>
                        <f.icon className={`h-5 w-5 ${f.color}`} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Everything you need to ace your semester</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Powerful tools designed for college students, all in one dashboard.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Brain, title: 'AI Study Assistant', desc: 'Ask academic questions, get simple explanations, and generate summaries.', iconBg: 'bg-sky-50 text-sky-500 dark:bg-sky-950' },
              { icon: NotebookPen, title: 'Notes Management', desc: 'Create, edit, and organize notes by subject. Full CRUD at your fingertips.', iconBg: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950' },
              { icon: BookOpen, title: 'Subject Management', desc: 'Add and manage your subjects with color coding and descriptions.', iconBg: 'bg-violet-50 text-violet-500 dark:bg-violet-950' },
              { icon: ListTodo, title: 'Study Tasks', desc: 'Create tasks, set priorities and due dates, and track completion.', iconBg: 'bg-amber-50 text-amber-500 dark:bg-amber-950' },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg}`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="bg-slate-50 py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Organize your learning by subject</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Keep notes and tasks connected to the subjects that matter.</p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { name: 'Mathematics', icon: '📐', color: 'sky' },
              { name: 'Physics', icon: '⚛️', color: 'violet' },
              { name: 'Chemistry', icon: '🧪', color: 'emerald' },
              { name: 'Biology', icon: '🧬', color: 'rose' },
              { name: 'Computer Science', icon: '💻', color: 'amber' },
              { name: 'Literature', icon: '📚', color: 'cyan' },
            ].map((s) => (
              <div key={s.name} className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section id="ai" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                <MessageSquare className="h-4 w-4" /> AI Assistant
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ask anything. Get answers instantly.</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Our AI study assistant is available 24/7. Ask academic questions, request summaries,
                generate study notes, or get help with programming — all through a simple chat interface.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Simple explanations of complex topics',
                  'Instant summaries of chapters and concepts',
                  'Generate structured study notes',
                  'Programming help with code examples',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-8 inline-block">
                <Button size="lg">Try it now <ArrowRight className="h-5 w-5" /></Button>
              </Link>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-sky-600 px-4 py-2.5 text-sm text-white">
                    Can you explain Big-O notation simply?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Big-O describes how an algorithm's runtime grows with input size. O(1) is constant
                    (same time always), O(n) grows linearly, and O(n²) grows quadratically. It helps
                    you compare algorithm efficiency!
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-sky-600 px-4 py-2.5 text-sm text-white">
                    Give me a quick summary of photosynthesis.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Photosynthesis converts light energy into chemical energy. Plants use sunlight,
                    CO₂, and water to produce glucose and oxygen. It happens in chloroplasts via
                    light-dependent and light-independent (Calvin cycle) reactions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-sky-600 to-cyan-500 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Calendar className="mx-auto h-12 w-12 text-white/90" />
          <h2 className="mt-4 text-3xl font-bold text-white">Ready to study smarter?</h2>
          <p className="mt-3 text-sky-100">Join CampusAI today and transform the way you learn.</p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" variant="secondary" className="bg-white text-sky-700 hover:bg-sky-50">
              Create your free account <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white">CampusAI</span>
            </div>
            <p className="text-sm text-slate-400">Your AI Student Companion — built for college students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
