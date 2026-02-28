'use client';

import { useState } from 'react';
import Link from 'next/link';
import { summarizeNote } from '@/lib/api';
import type { NoteViewProps } from '@/types';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import CopyButton from '@/components/ui/CopyButton';

export default function NoteView({
  noteId,
  noteText,
  password,
  createdAt,
  expiresAt,
}: NoteViewProps) {
  const [summary, setSummary]                   = useState<string>('');
  const [isSummarizing, setIsSummarizing]       = useState<boolean>(false);
  const [summarizeError, setSummarizeError]     = useState<string>('');
  const [hasSummarized, setHasSummarized]       = useState<boolean>(false);

  const handleSummarize = async (): Promise<void> => {
    setSummarizeError('');
    setIsSummarizing(true);

    const result = await summarizeNote(noteId, password);
    setIsSummarizing(false);

    if (result.success && result.data) {
      setSummary(result.data.summary);
      setHasSummarized(true);
    } else {
      setSummarizeError(result.error ?? 'Failed to summarize. Please try again.');
    }
  };

  const summaryLines: string[] = summary
    ? summary.split('\n').map((l) => l.trim()).filter(Boolean)
    : [];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 animate-fade-up">

      
      <div className="card p-6 sm:p-7">

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 bg-brand-500 rounded-full" />
            <span className="label">Unlocked note</span>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={noteText} label="Copy text" />
            <span className="badge-green text-[10px] px-2 py-1">
              <svg
                className="w-2.5 h-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Verified
            </span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5 min-h-[100px]">
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
            {noteText}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          {createdAt && (
            <p className="text-white/25 text-xs font-mono">
              Created: {new Date(createdAt).toLocaleDateString()}
            </p>
          )}
          {expiresAt && (
            <p className="text-yellow-500/50 text-xs font-mono">
              Expires: {new Date(expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="divider mt-5" />
        <div className="mt-5">
          {!hasSummarized ? (
            <>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✨</span>
                </div>
                <div>
                  <p className="text-white/70 text-sm font-medium">AI Summary</p>
                  <p className="text-white/30 text-xs mt-0.5">
                    Get a quick summary of this note using AI
                  </p>
                </div>
              </div>

              <Alert type="error" message={summarizeError} />

              <button
                onClick={handleSummarize}
                disabled={isSummarizing}
                className="btn-secondary w-full h-10 text-sm mt-3"
              >
                {isSummarizing ? (
                  <>
                    <Spinner size="sm" color="gray" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Summarize this note
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="animate-fade-up">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">✨</span>
                  <span className="label">AI Summary</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/20 font-mono">gemini</span>
                  <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="text-[10px] text-white/30 hover:text-white/60 transition-colors font-mono"
                  >
                    {isSummarizing ? 'regenerating...' : '↺ regenerate'}
                  </button>
                </div>
              </div>

              <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-5 space-y-2.5">
                {summaryLines.map((line: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-brand-500 text-xs mt-0.5 flex-shrink-0">•</span>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {line.startsWith('•') ? line.slice(1).trim() : line}
                    </p>
                  </div>
                ))}
              </div>

              {summarizeError && (
                <div className="mt-3">
                  <Alert type="error" message={summarizeError} />
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="text-center pb-4">
        <Link href="/" className="btn-ghost text-xs text-white/30">
          ← Create your own private note
        </Link>
      </div>

    </div>
  );
}
