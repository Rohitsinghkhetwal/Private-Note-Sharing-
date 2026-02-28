'use client';

import { useState } from 'react';
import { unlockNote } from '@/lib/api';
import type { UnlockNoteFormProps, UnlockedNoteData } from '@/types';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

export default function UnlockNoteForm({
  noteId,
  expiresAt,
  onUnlocked,
}: UnlockNoteFormProps) {
  const [password, setPassword]   = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError]         = useState<string>('');
  const [showPass, setShowPass]   = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('Please enter the password.');
      return;
    }

    setIsLoading(true);
    const result = await unlockNote(noteId, password.trim());
    setIsLoading(false);

    if (result.success && result.data) {
      onUnlocked(result.data as UnlockedNoteData, password.trim());
    } else {
      if (result.status === 401) {
        setError('Incorrect password. Please try again.');
      } else {
        setError(result.error ?? 'Failed to unlock note.');
      }
      setPassword('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <div className="card p-7">

        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-1.5">This note is private</h1>
          <p className="text-white/40 text-sm">
            Enter the password to unlock and read this note.
          </p>
        </div>

        {expiresAt && (
          <div className="badge-yellow w-full justify-center mb-5 py-2">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Expires: {new Date(expiresAt).toLocaleString()}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="label block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password..."
                autoFocus
                autoComplete="off"
                className="input pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Alert type="error" message={error} />

          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="btn-primary w-full h-11 text-sm"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" />
                Unlocking...
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
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
                Unlock Note
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
