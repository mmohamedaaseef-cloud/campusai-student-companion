import { useCallback, useEffect, useRef, useState } from 'react';
import { Brain, Send, User, Sparkles, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Card, PageHeader } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Card';
import { useToast } from '@/components/Toast';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'Explain Big-O notation simply',
  'Summarize the process of photosynthesis',
  'Generate study notes on Newton\'s laws of motion',
  'How do I reverse a linked list in Python?',
];

export function AIAssistantPage() {
  const { show } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        show('Please sign in to use the AI assistant', 'error');
        setLoading(false);
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ messages: [...messagesRef.current, userMsg] }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      if (!data.reply) throw new Error('Invalid response from AI service');

      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      show(msg, 'error');
      setMessages((m) => [...m, { role: 'assistant', content: `Sorry, I couldn't process that. ${msg}` }]);
    } finally {
      setLoading(false);
    }
  }, [loading, show]);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <PageHeader
        title="AI Study Assistant"
        subtitle="Ask academic questions, get summaries, generate study notes, and more."
        action={
          messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <Trash2 className="h-4 w-4" /> Clear chat
            </button>
          )
        }
      />

      <Card className="flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg">
                <Brain className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">How can I help you study?</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try one of these suggestions:</p>
              </div>
              <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-700 transition-colors hover:border-sky-300 hover:bg-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-700 dark:hover:bg-sky-950"
                  >
                    <Sparkles className="h-4 w-4 shrink-0 text-sky-500" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    m.role === 'user'
                      ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200'
                      : 'bg-gradient-to-br from-sky-500 to-cyan-400 text-white'
                  }`}>
                    {m.role === 'user' ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-400 text-white">
                    <Brain className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 dark:bg-slate-800">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mx-auto flex max-w-3xl items-end gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything about your studies..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
              style={{ maxHeight: '120px' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Spinner className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
