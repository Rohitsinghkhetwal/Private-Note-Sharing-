import axios, { AxiosError } from 'axios';
import type {
  ApiResult,
  CreatedNoteData,
  NoteExistsData,
  UnlockedNoteData,
  SummaryData,
  ExpiryValue,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError) {
    return err.response?.data?.error || fallback;
  }
  return fallback;
};

const getErrorStatus = (err: unknown): number | undefined => {
  if (err instanceof AxiosError) {
    return err.response?.status;
  }
  return undefined;
};

export const createNote = async (
  text: string,
  expiresIn: ExpiryValue = 'never'
): Promise<ApiResult<CreatedNoteData>> => {
  try {
    const res = await api.post('/notes', { text, expiresIn });
    return { success: true, data: res.data.data as CreatedNoteData };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, 'Failed to create note. Please try again.'),
    };
  }
};

export const checkNoteExists = async (
  noteId: string
): Promise<ApiResult<NoteExistsData>> => {
  try {
    const res = await api.get(`/notes/${noteId}/exists`);
    return { success: true, data: res.data.data as NoteExistsData };
  } catch (err) {
    return {
      success: false,
      status: getErrorStatus(err),
      error: getErrorMessage(err, 'Note not found.'),
    };
  }
};

export const unlockNote = async (
  noteId: string,
  password: string
): Promise<ApiResult<UnlockedNoteData>> => {
  try {
    const res = await api.post(`/notes/${noteId}/unlock`, { password });
    return { success: true, data: res.data.data as UnlockedNoteData };
  } catch (err) {
    return {
      success: false,
      status: getErrorStatus(err),
      error: getErrorMessage(err, 'Failed to unlock note.'),
    };
  }
};

export const summarizeNote = async (
  noteId: string,
  password: string
): Promise<ApiResult<SummaryData>> => {
  try {
    const res = await api.post(`/notes/${noteId}/summarize`, { password });
    return { success: true, data: res.data.data as SummaryData };
  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err, 'Failed to summarize. Please try again.'),
    };
  }
};
