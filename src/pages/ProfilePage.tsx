import { useState, useEffect } from 'react';
import { User, Building2, GraduationCap, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';
import { Card, PageHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Field } from '@/components/ui/Input';

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const { show } = useToast();
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    college: profile?.college ?? '',
    department: profile?.department ?? '',
    year: profile?.year ?? '1st Year',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        college: profile.college ?? '',
        department: profile.department ?? '',
        year: profile.year ?? '1st Year',
      });
    }
  }, [profile]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      full_name: form.full_name,
      college: form.college,
      department: form.department,
      year: form.year,
    }).eq('id', profile?.id ?? '');
    setSaving(false);
    if (error) {
      show(error.message, 'error');
    } else {
      await refreshProfile();
      show('Profile updated successfully', 'success');
    }
  };

  const infoItems = [
    { icon: Building2, label: 'College', value: profile?.college || 'Not set' },
    { icon: GraduationCap, label: 'Department', value: profile?.department || 'Not set' },
    { icon: Calendar, label: 'Year', value: profile?.year || 'Not set' },
  ];

  return (
    <div>
      <PageHeader title="Profile" subtitle="View and update your profile information." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-2xl font-bold text-white shadow-lg">
              {profile?.full_name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {profile?.full_name || 'Student'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{profile?.department || 'Department'}</p>
          </div>
          <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
            {infoItems.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Edit form */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-4 font-bold text-slate-900 dark:text-white">Edit Profile</h3>
          <div className="space-y-4">
            <Field label="Full Name">
              <Input
                value={form.full_name}
                onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                placeholder="Your name"
              />
            </Field>
            <Field label="College">
              <Input
                value={form.college}
                onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))}
                placeholder="Your college"
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Department">
                <Input
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  placeholder="Your department"
                />
              </Field>
              <Field label="Year">
                <Select
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                </Select>
              </Field>
            </div>
            <div className="pt-2">
              <Button onClick={save} loading={saving}>
                <User className="h-4 w-4" /> Save changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
