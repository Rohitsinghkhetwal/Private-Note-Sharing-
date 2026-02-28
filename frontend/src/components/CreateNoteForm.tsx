'use client';

import { useState } from 'react';
import { createNote } from '@/lib/api';
import type { ExpiryValue, ExpiryOption, CreatedNoteData } from '@/types';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import NoteCreatedView from '@/components/NoteCreatedView';

const MAX_CHARS = 500;

const EXPIRY_OPTIONS: ExpiryOption[] = [
  { value: 'never', label: '∞  Never expires',  desc: 'Available until deleted' },
  { value: '1h',    label: '1 hour',             desc: 'Auto-deletes after 1 hour' },
  { value: '24h',   label: '24 hours',           desc: 'Auto-deletes tomorrow' },
  { value: '7d',    label: '7 days',             desc: 'Auto-deletes next week' },
  { value: '30d',   label: '30 days',            desc: 'Auto-deletes next month' },
];

export default function CreateNoteForm() {
  const [text, setText]               = useState<string>('');
  const [expiresIn, setExpiresIn]     = useState<ExpiryValue>('never');
  const [isLoading, setIsLoading]     = useState<boolean>(false);
  const [error, setError]             = useState<string>('');
  const [createdNote, setCreatedNote] = useState<CreatedNoteData | null>(null);

  const charsUsed  = text.length;
  const charsLeft  = MAX_CHARS - charsUsed;
  const isOverLimit = charsLeft < 0;
  const isNearLimit = charsLeft >= 0 && charsLeft < 50;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!text.trim()) {
      setError('Please write something before creating a note.');
      return;
    }
    if (isOverLimit) {
      setError(`Note is too long. Remove ${Math.abs(charsLeft)} characters.`);
      return;
    }

    setIsLoading(true);
    const result = await createNote(text.trim(), expiresIn);
    setIsLoading(false);

    if (result.success && result.data) {
      setCreatedNote(result.data);
    } else {
      setError(result.error ?? 'Something went wrong.');
    }
  };

  const handleReset = (): void => {
    setCreatedNote(null);
    setText('');
    setExpiresIn('never');
    setError('');
  };

  if (createdNote) {
    return <NoteCreatedView data={createdNote} onReset={handleReset} />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8 animate-fade-up">
        <div className="badge-green mx-auto mb-5 w-fit">
          <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
          End-to-end private
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Create a private note
        </h1>
        <p className="text-white/40 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Write your note, get a secure link and password.
          Only people with both can read it.
        </p>
      </div>

      <div
        className="card p-6 sm:p-7 animate-fade-up"
        style={{ animationDelay: '0.05s', opacity: 0 }}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label" htmlFor="note-text">
                Your note
              </label>
              <span
                className={`text-xs font-mono transition-colors ${
                  isOverLimit ? 'text-red-400 font-semibold' :
                  isNearLimit ? 'text-yellow-400' :
                                'text-white/30'
                }`}
              >
                {charsUsed} / {MAX_CHARS}
              </span>
            </div>

            <textarea
              id="note-text"
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              placeholder="Write your private note here..."
              rows={7}
              autoFocus
              className={`textarea ${
                isOverLimit
                  ? 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20'
                  : ''
              }`}
            />

            <div className="mt-2 h-0.5 bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isOverLimit ? 'bg-red-500' :
                  isNearLimit ? 'bg-yellow-500' :
                                'bg-brand-500'
                }`}
                style={{ width: `${Math.min((charsUsed / MAX_CHARS) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <label className="label block mb-2.5">Note expiry</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {EXPIRY_OPTIONS.map((opt: ExpiryOption) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExpiresIn(opt.value)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-150
                    ${
                      expiresIn === opt.value
                        ? 'bg-brand-500/10 border-brand-500/40 text-brand-400'
                        : 'bg-white/[0.03] border-white/[0.06] text-white/50 hover:bg-white/[0.06] hover:text-white/70'
                    }`}
                >
                  <div className="font-semibold mb-0.5">{opt.label}</div>
                  <div className="text-[10px] opacity-60 font-normal leading-tight">
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Alert type="error" message={error} />

          <button
            type="submit"
            disabled={isLoading || !text.trim() || isOverLimit}
            className="btn-primary w-full h-12 text-sm"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" color="white" />
                Creating secure note...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Create Private Note
              </>
            )}
          </button>

        </form>
      </div>

      <div
        className="mt-8 grid grid-cols-3 gap-3 animate-fade-up"
        style={{ animationDelay: '0.1s', opacity: 0 }}
      >
        {[
          { icon: '✍️', title: 'Write',  desc: 'Type your secret note' },
          { icon: '🔗', title: 'Share',  desc: 'Get a link + password' },
          { icon: '🔓', title: 'Unlock', desc: 'Password required to read' },
        ].map((item) => (
          <div key={item.title} className="card p-4 text-center">
            <div className="text-xl mb-2">{item.icon}</div>
            <p className="text-xs font-semibold text-white/70 mb-0.5">{item.title}</p>
            <p className="text-xs text-white/30 leading-snug">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
