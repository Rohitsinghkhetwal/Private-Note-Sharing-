'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { checkNoteExists } from '@/lib/api';
import type { NotePageState, UnlockedNoteData } from '@/types';
import Navbar from '@/components/Navbar';
import UnlockNoteForm from '@/components/UnlockNoteForm';
import NoteView from '@/components/NoteView';
import Spinner from '@/components/ui/Spinner';

const PAGE_STATE: Record<string, NotePageState> = {
  LOADING:   'loading',
  NOT_FOUND: 'not_found',
  EXPIRED:   'expired',
  LOCKED:    'locked',
  UNLOCKED:  'unlocked',
};

interface NoteState {
  text: string;
  createdAt: string;
  expiresAt: string | null;
}

export default function NotePage() {
  const params = useParams();
  const noteId = params.id as string;

  const [pageState, setPageState]   = useState<NotePageState>('loading');
  const [expiresAt, setExpiresAt]   = useState<string | null>(null);
  const [noteData, setNoteData]     = useState<NoteState | null>(null);
  const [password, setPassword]     = useState<string>('');

  // Check if note exists on mount
  useEffect(() => {
    if (!noteId) return;

    const checkNote = async (): Promise<void> => {
      const result = await checkNoteExists(noteId);

      if (result.success && result.data) {
        setExpiresAt(result.data.expiresAt);
        setPageState(PAGE_STATE.LOCKED);
      } else {
        if (result.status === 410) {
          setPageState(PAGE_STATE.EXPIRED);
        } else {
          setPageState(PAGE_STATE.NOT_FOUND);
        }
      }
    };

    checkNote();
  }, [noteId]);

  // Called when password is verified and note is unlocked
  const handleUnlocked = (data: UnlockedNoteData, usedPassword: string): void => {
    setNoteData({
      text: data.text,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
    });
    setPassword(usedPassword);
    setPageState(PAGE_STATE.UNLOCKED);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-14 flex flex-col items-center justify-center px-4 py-16">

        {/* Back link */}
        <div className="w-full max-w-2xl mb-5">
          <Link href="/" className="btn-ghost text-xs text-white/30 px-0">
            ← Back to home
          </Link>
        </div>

        {/* Loading */}
        {pageState === PAGE_STATE.LOADING && (
          <div className="card w-full max-w-md p-10 flex flex-col items-center gap-4 animate-fade-in">
            <Spinner size="lg" color="gray" />
            <p className="text-white/40 text-sm">Checking note...</p>
          </div>
        )}

        {/* Not found */}
        {pageState === PAGE_STATE.NOT_FOUND && (
          <StatusScreen
            emoji="🔍"
            title="Note not found"
            description="This note doesn't exist or may have been deleted. Please double-check the link."
            actionLabel="Create a new note"
            actionHref="/"
          />
        )}

        {/* Expired */}
        {pageState === PAGE_STATE.EXPIRED && (
          <StatusScreen
            emoji="⏱"
            title="Note has expired"
            description="This note has passed its expiry time and has been automatically deleted."
            actionLabel="Create a new note"
            actionHref="/"
          />
        )}

        {/* Locked */}
        {pageState === PAGE_STATE.LOCKED && (
          <UnlockNoteForm
            noteId={noteId}
            expiresAt={expiresAt}
            onUnlocked={handleUnlocked}
          />
        )}

        {/* Unlocked */}
        {pageState === PAGE_STATE.UNLOCKED && noteData && (
          <NoteView
            noteId={noteId}
            noteText={noteData.text}
            password={password}
            createdAt={noteData.createdAt}
            expiresAt={noteData.expiresAt}
          />
        )}

      </main>
    </>
  );
}

// ── Status screen ─────────────────────────────────────────────
interface StatusScreenProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

function StatusScreen({
  emoji,
  title,
  description,
  actionLabel,
  actionHref,
}: StatusScreenProps) {
  return (
    <div className="card w-full max-w-md p-8 text-center animate-fade-up">
      <div className="text-4xl mb-4">{emoji}</div>
      <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
      <p className="text-white/40 text-sm leading-relaxed mb-6">{description}</p>
      <Link href={actionHref} className="btn-primary text-sm inline-flex">
        {actionLabel}
      </Link>
    </div>
  );
}
