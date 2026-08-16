import { useEffect, useState } from 'react';
import { Plus, ListTodo, Pencil, Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { supabase, type Task, type Subject } from '@/lib/supabase';
import { Card, PageHeader, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Field } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/Toast';

type Filter = 'all' | 'pending' | 'completed';

export function TasksPage() {
  const { show } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', subject_id: '', due_date: '', priority: 'medium' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [taskRes, subRes] = await Promise.all([
      supabase.from('tasks').select('*, subject:subjects(*)').order('created_at', { ascending: false }),
      supabase.from('subjects').select('*').order('name'),
    ]);
    setTasks(taskRes.data ?? []);
    setSubjects(subRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', subject_id: '', due_date: '', priority: 'medium' });
    setModalOpen(true);
  };

  const openEdit = (t: Task) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? '',
      subject_id: t.subject_id ?? '',
      due_date: t.due_date ?? '',
      priority: t.priority,
    });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      show('Task title is required', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      subject_id: form.subject_id || null,
      due_date: form.due_date || null,
      priority: form.priority,
    };
    const { error } = editing
      ? await supabase.from('tasks').update(payload).eq('id', editing.id)
      : await supabase.from('tasks').insert(payload);
    setSaving(false);
    if (error) { show(error.message, 'error'); return; }
    show(editing ? 'Task updated' : 'Task created', 'success');
    setModalOpen(false);
    load();
  };

  const toggle = async (t: Task) => {
    const { error } = await supabase.from('tasks').update({ completed: !t.completed }).eq('id', t.id);
    if (error) { show(error.message, 'error'); return; }
    load();
  };

  const remove = async (t: Task) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    const { error } = await supabase.from('tasks').delete().eq('id', t.id);
    if (error) { show(error.message, 'error'); return; }
    show('Task deleted', 'info');
    load();
  };

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const priorityBadge = (p: string) => {
    if (p === 'high') return 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400';
    if (p === 'medium') return 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400';
    return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
  };

  return (
    <div>
      <PageHeader
        title="Study Tasks"
        subtitle="Plan and track your study tasks."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Task</Button>}
      />

      {/* Filter tabs */}
      <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {(['all', 'pending', 'completed'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === f
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading tasks...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<ListTodo className="h-7 w-7" />}
            title="No tasks found"
            description={filter !== 'all' ? `No ${filter} tasks.` : 'Create your first study task.'}
            action={filter === 'all' ? <Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Task</Button> : undefined}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-start gap-3">
                <button onClick={() => toggle(t)} className="mt-0.5 shrink-0">
                  {t.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold ${t.completed ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {t.title}
                    </h3>
                    <div className="flex shrink-0 gap-1">
                      <button onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => remove(t)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {t.description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.description}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    {t.subject && (
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 font-medium text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                        {t.subject.name}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 font-medium ${priorityBadge(t.priority)}`}>
                      {t.priority} priority
                    </span>
                    {t.due_date && (
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Calendar className="h-3 w-3" />
                        Due {new Date(t.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Task' : 'Add Task'} size="lg">
        <div className="space-y-4">
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Review Chapter 5"
              autoFocus
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional details"
              rows={3}
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Subject">
              <Select
                value={form.subject_id}
                onChange={(e) => setForm((f) => ({ ...f, subject_id: e.target.value }))}
              >
                <option value="">No subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </Field>
            <Field label="Due Date">
              <Input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm((f) => ({ ...f, due_date: e.target.value }))}
              />
            </Field>
            <Field label="Priority">
              <Select
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editing ? 'Save changes' : 'Add task'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
