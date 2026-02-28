'use client';

import Link from 'next/link';
import type { NoteCreatedViewProps } from '@/types';
import CopyButton from '@/components/ui/CopyButton';

export default function NoteCreatedView({ data, onReset }: NoteCreatedViewProps) {
  const { url, password, expiresAt } = data;

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-up">

      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-7 h-7 text-brand-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Note created!</h1>
        <p className="text-white/40 text-sm">
          Save your password now — it will never be shown again.
        </p>
      </div>

      <div className="card p-6 sm:p-7 space-y-6">

        {/* If we want to share the link we can share from here  */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label">Shareable link</label>
            <CopyButton text={url} label="Copy link" />
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
            <svg
              className="w-3.5 h-3.5 text-white/30 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <p className="text-white/60 text-sm font-mono truncate flex-1">{url}</p>
          </div>
        </div>

        <div className="divider" />

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label">Password</label>
            <CopyButton text={password} label="Copy password" />
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-5 py-4">
            <p className="text-yellow-300 text-2xl font-mono font-semibold tracking-[0.25em] text-center">
              {password}
            </p>
          </div>

          {/* One-time warning  */}
          <div className="flex items-start gap-2.5 mt-3 bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-3">
            <svg
              className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-400 text-xs leading-relaxed">
              <strong>This password is shown only once</strong> and is not stored anywhere.
              If you lose it, the note cannot be recovered.
            </p>
          </div>
        </div>

        {expiresAt && (
          <div className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
            <svg
              className="w-4 h-4 text-white/30"
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
            <p className="text-white/50 text-xs">
              Expires:{' '}
              <span className="text-white/70 font-medium">
                {new Date(expiresAt).toLocaleString()}
              </span>
            </p>
          </div>
        )}

        <div className="divider" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={url}
            target="_blank"
            className="btn-secondary flex-1 text-sm h-11"
          >
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Preview note
          </Link>
          <button onClick={onReset} className="btn-primary flex-1 text-sm h-11">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create another note
          </button>
        </div>

      </div>
    </div>
  );
}
