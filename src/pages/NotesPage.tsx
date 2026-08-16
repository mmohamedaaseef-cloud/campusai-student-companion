import { useEffect, useState } from 'react';
import { Plus, NotebookPen, Pencil, Trash2, Search } from 'lucide-react';
import { supabase, type Note, type Subject } from '@/lib/supabase';
import { Card, PageHeader, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Field } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/Toast';

export function NotesPage() {
  const { show } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: '', content: '', subject_id: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [noteRes, subRes] = await Promise.all([
      supabase.from('notes').select('*, subject:subjects(*)').order('updated_at', { ascending: false }),
      supabase.from('subjects').select('*').order('name'),
    ]);
    setNotes(noteRes.data ?? []);
    setSubjects(subRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', content: '', subject_id: '' });
    setModalOpen(true);
  };

  const openEdit = (n: Note) => {
    setEditing(n);
    setForm({ title: n.title, content: n.content, subject_id: n.subject_id ?? '' });
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      show('Title is required', 'error');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      content: form.content,
      subject_id: form.subject_id || null,
    };
    const { error } = editing
      ? await supabase.from('notes').update(payload).eq('id', editing.id)
      : await supabase.from('notes').insert(payload);
    setSaving(false);
    if (error) {
      show(error.message, 'error');
      return;
    }
    show(editing ? 'Note updated' : 'Note created', 'success');
    setModalOpen(false);
    load();
  };

  const remove = async (n: Note) => {
    if (!confirm(`Delete "${n.title}"?`)) return;
    const { error } = await supabase.from('notes').delete().eq('id', n.id);
    if (error) { show(error.message, 'error'); return; }
    show('Note deleted', 'info');
    load();
  };

  const filtered = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = filterSubject === 'all' || n.subject_id === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div>
      <PageHeader
        title="My Notes"
        subtitle="Create, edit, and organize your study notes."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> New Note</Button>}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="sm:w-48">
          <option value="all">All Subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading notes...</div>
      ) : filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={<NotebookPen className="h-7 w-7" />}
            title="No notes found"
            description={search || filterSubject !== 'all' ? 'Try adjusting your filters.' : 'Create your first note to get started.'}
            action={!search && filterSubject === 'all' ? <Button onClick={openCreate}><Plus className="h-4 w-4" /> New Note</Button> : undefined}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n) => (
            <Card key={n.id} className="flex flex-col p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white">{n.title}</h3>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(n)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(n)} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mb-3 flex-1 text-sm text-slate-500 line-clamp-4 dark:text-slate-400">
                {n.content || 'No content'}
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className={`rounded-full px-2 py-0.5 font-medium ${
                  n.subject ? 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                }`}>
                  {n.subject?.name || 'No subject'}
                </span>
                <span>{new Date(n.updated_at).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Note' : 'New Note'} size="lg">
        <div className="space-y-4">
          <Field label="Title">
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Note title"
              autoFocus
            />
          </Field>
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
          <Field label="Content">
            <Textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your note here..."
              rows={8}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={save} loading={saving}>{editing ? 'Save changes' : 'Create note'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
