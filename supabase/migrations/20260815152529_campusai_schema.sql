/*
# CampusAI — initial schema

## Overview
Creates the data model for CampusAI, a per-user student companion app with
authentication, subjects, notes, study tasks, and profile management.

## New Tables
1. `profiles` — extends Supabase `auth.users` with student details.
   - `id` (uuid, PK, references auth.users, ON DELETE CASCADE)
   - `full_name` (text)
   - `college` (text)
   - `department` (text)
   - `year` (text)
   - `created_at`, `updated_at` (timestamptz)
2. `subjects` — subjects owned by a student.
   - `id` (uuid PK)
   - `user_id` (uuid, default auth.uid(), references auth.users, ON DELETE CASCADE)
   - `name` (text)
   - `description` (text, nullable)
   - `color` (text, default 'blue')
   - `created_at` (timestamptz)
3. `notes` — notes owned by a student, optionally tied to a subject.
   - `id` (uuid PK)
   - `user_id` (uuid, default auth.uid(), references auth.users, ON DELETE CASCADE)
   - `title` (text)
   - `content` (text)
   - `subject_id` (uuid, nullable, references subjects, ON DELETE SET NULL)
   - `created_at`, `updated_at` (timestamptz)
4. `tasks` — study tasks owned by a student.
   - `id` (uuid PK)
   - `user_id` (uuid, default auth.uid(), references auth.users, ON DELETE CASCADE)
   - `title` (text)
   - `description` (text, nullable)
   - `subject_id` (uuid, nullable, references subjects, ON DELETE SET NULL)
   - `due_date` (date, nullable)
   - `priority` (text, default 'medium')
   - `completed` (boolean, default false)
   - `created_at` (timestamptz)

## Security
- RLS enabled on every table.
- `profiles`: a user can read/update only their own profile row (id = auth.uid()).
- `subjects`, `notes`, `tasks`: owner-scoped CRUD (auth.uid() = user_id) for
  authenticated users. Owner columns default to auth.uid() so inserts that omit
  user_id still satisfy the WITH CHECK predicate.

## Important Notes
1. This is a multi-user app with a sign-in screen; all policies are scoped to
   `authenticated` with ownership checks.
2. `user_id` columns default to `auth.uid()` so frontend inserts omitting
   `user_id` still pass the INSERT WITH CHECK.
3. A trigger auto-creates a profile row when a new auth.user signs up.
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  college text NOT NULL DEFAULT '',
  department text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- subjects
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  color text NOT NULL DEFAULT 'blue',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_subjects" ON subjects;
CREATE POLICY "select_own_subjects" ON subjects FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_subjects" ON subjects;
CREATE POLICY "insert_own_subjects" ON subjects FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_subjects" ON subjects;
CREATE POLICY "update_own_subjects" ON subjects FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_subjects" ON subjects;
CREATE POLICY "delete_own_subjects" ON subjects FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- notes
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notes" ON notes;
CREATE POLICY "select_own_notes" ON notes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_notes" ON notes;
CREATE POLICY "insert_own_notes" ON notes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_notes" ON notes;
CREATE POLICY "update_own_notes" ON notes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_notes" ON notes;
CREATE POLICY "delete_own_notes" ON notes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  subject_id uuid REFERENCES subjects(id) ON DELETE SET NULL,
  due_date date,
  priority text NOT NULL DEFAULT 'medium',
  completed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_tasks" ON tasks;
CREATE POLICY "select_own_tasks" ON tasks FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_tasks" ON tasks;
CREATE POLICY "insert_own_tasks" ON tasks FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_tasks" ON tasks;
CREATE POLICY "update_own_tasks" ON tasks FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_tasks" ON tasks;
CREATE POLICY "delete_own_tasks" ON tasks FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- indexes
CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_user ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);

-- updated_at triggers
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_notes_updated ON notes;
CREATE TRIGGER trg_notes_updated BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
