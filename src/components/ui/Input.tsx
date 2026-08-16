import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

const baseField =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500';

export function Input({ className = '', ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${baseField} ${className}`} {...rest} />;
}

export function Textarea({ className = '', ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${baseField} resize-none ${className}`} {...rest} />;
}

export function Select({ className = '', children, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className={`${baseField} cursor-pointer ${className}`} {...rest}>
      {children}
    </select>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
      {children}
    </label>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}
