import { useEffect, useState } from 'react';
import { Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import { supabase, type Subject } from '@/lib/supabase';
import { Card, PageHeader, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Field } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/Toast';

const COLORS = [
  { name: 'blue', class: 'bg-blue-500' },
  { name: 'emerald', class: 'bg-emerald-500' },
  { name: 'violet', class: 'bg-violet-500' },
  { name: 'amber', class: 'bg-amber-500' },
  { name: 'rose', class: 'bg-rose-500' },
  { name: 'cyan', class: 'bg-cyan-500' },
  { name: 'orange', class: 'bg-orange-500' },
  { name: 'teal', class: 'bg-teal-500' },
];

export function SubjectsPage() {
  const { show } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState({ name: '', description: '', color: 'blue' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('subjects').select('*').order('created_at', { ascending: false });
    if (error) show(error.message, 'error');
    setSubjects(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', color: 'blue' });
    setModalOpen(true);
  };

  const openEdit = (s: Subject) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description ?? '', color: s.color });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      show('Subject name is required', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      color: form.color,
    };
    const { error } = editing
      ? await supabase.from('subjects').update(payload).eq('id', editing.id)
      : await supabase.from('subjects').insert(payload);
    setSaving(false);
    if (error) { show(error.message, 'error'); return; }
    show(editing ? 'Subject updated' : 'Subject added', 'success');
    setModalOpen(false);
    load();
  };

  const remove = async (s: Subject) => {
    if (!confirm(`Delete "${s.name}"? Notes and tasks linked to it will be unlinked.`)) return;
    const { error } = await supabase.from('subjects').delete().eq('id', s.id);
    if (error) { show(error.message, 'error'); return; }
    show('Subject deleted', 'info');
    load();
  };

  const colorClass = (c: string) => COLORS.find((x) => x.name === c)?.class ?? 'bg-blue-500';

  return (
    <div>
      <PageHeader
        title="Subjects"
        subtitle="Organize your courses and subjects."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Subject</Button>}
      />

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<BookOpen className="h-7 w-7" />}
            title="No subjects yet"
            description="Add your first subject to start organizing your notes and tasks."
            action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Subject</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <Card key={s.id} className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass(s.color)} text-white`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{s.name}</h3>
                    <p className="text-xs text-slate-400">Added {new Date(s.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(s)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {s.description || 'No description'}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Subject' : 'Add Subject'}>
        <div className="space-y-4">
          <Field label="Subject Name">
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Mathematics"
              autoFocus
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
              rows={3}
            />
          </Field>
          <Field label="Color">
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c.name }))}
                  className={`h-9 w-9 rounded-lg ${c.class} transition-all ${
                    form.color === c.name ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editing ? 'Save changes' : 'Add subject'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
