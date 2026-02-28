

export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: string[];
}



export interface CreatedNoteData {
  url: string;
  password: string;
  noteId: string;
  expiresAt: string | null;
}

export interface NoteExistsData {
  exists: boolean;
  expiresAt: string | null;
}

export interface UnlockedNoteData {
  text: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface SummaryData {
  summary: string;
}


export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}



export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'white' | 'green' | 'gray';
}

export interface AlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
}

export interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export interface NoteCreatedViewProps {
  data: CreatedNoteData;
  onReset: () => void;
}

export interface UnlockNoteFormProps {
  noteId: string;
  expiresAt: string | null;
  onUnlocked: (data: UnlockedNoteData, password: string) => void;
}

export interface NoteViewProps {
  noteId: string;
  noteText: string;
  password: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface StatusScreenProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}



export type ExpiryValue = 'never' | '1h' | '24h' | '7d' | '30d';

export interface ExpiryOption {
  value: ExpiryValue;
  label: string;
  desc: string;
}



export type NotePageState = 'loading' | 'not_found' | 'expired' | 'locked' | 'unlocked';
