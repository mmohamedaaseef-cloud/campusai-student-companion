import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastContextValue = { show: (message: string, type?: Toast['type']) => void };

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg animate-[slideIn_0.2s_ease-out] dark:border-slate-700 dark:bg-slate-800"
          >
            {t.type === 'success' && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
            {t.type === 'error' && <XCircle className="h-5 w-5 shrink-0 text-rose-500" />}
            {t.type === 'info' && <Info className="h-5 w-5 shrink-0 text-sky-500" />}
            <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
