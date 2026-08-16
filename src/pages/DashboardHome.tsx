import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  NotebookPen,
  BookOpen,
  ListTodo,
  CheckCircle2,
  Brain,
  ArrowRight,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, type Subject, type Note, type Task } from '@/lib/supabase';
import { Card, PageHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Card';

export function DashboardHome() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalNotes, setTotalNotes] = useState(0);

  useEffect(() => {
    (async () => {
      const [subRes, noteRes, taskRes, taskCountRes, noteCountRes] = await Promise.all([
        supabase.from('subjects').select('*').order('created_at', { ascending: false }),
        supabase.from('notes').select('*, subject:subjects(*)').order('updated_at', { ascending: false }).limit(5),
        supabase.from('tasks').select('*, subject:subjects(*)').order('created_at', { ascending: false }).limit(5),
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('notes').select('id', { count: 'exact', head: true }),
      ]);
      setSubjects(subRes.data ?? []);
      setNotes(noteRes.data ?? []);
      setTasks(taskRes.data ?? []);
      setTotalTasks(taskCountRes.count ?? 0);
      setTotalNotes(noteCountRes.count ?? 0);
      setLoading(false);
    })();
  }, []);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950' },
    { label: 'Notes', value: totalNotes, icon: NotebookPen, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Completed', value: completedTasks, icon: CheckCircle2, color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950' },
  ];

  const quickActions = [
    { to: '/dashboard/assistant', label: 'Ask AI', desc: 'Get instant help', icon: Brain, color: 'from-sky-500 to-cyan-400' },
    { to: '/dashboard/notes', label: 'New Note', desc: 'Write a note', icon: NotebookPen, color: 'from-emerald-500 to-teal-400' },
    { to: '/dashboard/tasks', label: 'Add Task', desc: 'Plan your study', icon: ListTodo, color: 'from-amber-500 to-orange-400' },
    { to: '/dashboard/subjects', label: 'Add Subject', desc: 'Organize courses', icon: BookOpen, color: 'from-violet-500 to-purple-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${profile?.full_name?.split(' ')[0] || 'Student'}!`}
        subtitle={`${profile?.college || 'College'} • ${profile?.department || 'Department'} • ${profile?.year || 'Year'}`}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Progress + Quick actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-sky-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Study Progress</h3>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-36 w-36">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                <circle
                  cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                  className="text-sky-500 transition-all duration-500"
                  strokeDasharray={`${(progress / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{progress}%</span>
                <span className="text-xs text-slate-400">Complete</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-slate-500">{completedTasks} done</span>
            <span className="text-slate-500">{pendingTasks} pending</span>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickActions.map((a) => (
              <Link key={a.to} to={a.to}>
                <Card className="group h-full p-5 hover:-translate-y-0.5">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} text-white shadow-sm`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{a.label}</p>
                  <p className="text-xs text-slate-400">{a.desc}</p>
                </Card>
              </Link>
            ))}
          </div>

          {/* AI assistant preview */}
          <Link to="/dashboard/assistant" className="mt-4 block">
            <Card className="flex items-center gap-4 bg-gradient-to-r from-sky-50 to-cyan-50 p-5 dark:from-sky-950 dark:to-cyan-950">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-sm">
                <Brain className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Ask your AI Study Assistant</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get explanations, summaries, and study notes instantly.</p>
              </div>
              <ArrowRight className="h-5 w-5 text-sky-500" />
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Notes</h3>
            <Link to="/dashboard/notes" className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">
              View all
            </Link>
          </div>
          {notes.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No notes yet. Create your first note!</p>
          ) : (
            <div className="space-y-2">
              {notes.map((n) => (
                <div key={n.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  <NotebookPen className="h-4 w-4 shrink-0 text-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{n.title}</p>
                    <p className="truncate text-xs text-slate-400">{n.subject?.name || 'No subject'}</p>
                  </div>
                  <Clock className="h-3.5 w-3.5 text-slate-300" />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white">Recent Tasks</h3>
            <Link to="/dashboard/tasks" className="text-sm font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400">
              View all
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">No tasks yet. Add your first study task!</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                  {t.completed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${t.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                      {t.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t.subject?.name || 'No subject'}
                      {t.due_date && ` • Due ${new Date(t.due_date).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    t.priority === 'high' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400' :
                    t.priority === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' :
                    'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
