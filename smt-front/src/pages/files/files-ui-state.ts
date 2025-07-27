import { atom } from 'jotai';
import type { File } from '../../types/file';

// UI state atoms (modals, selected file)
export const createModalOpenAtom = atom<boolean>(false);
export const deleteModalOpenAtom = atom<File | null>(null);
export const selectedFileAtom = atom<globalThis.File | null>(null);

// Filter state for UI (for main table filtering)
export interface FilterState {
  documentType: string | null;
  projectId: string | null;
  subprojectId: string | null;
  revisionId: string | null;
}

export const filterStateAtom = atom<FilterState>({
  documentType: null,
  projectId: null,
  subprojectId: null,
  revisionId: null
});

// Create modal state (independent from filters)
export interface CreateModalState {
  name: string;
  projectId: string | null;
  subprojectId: string | null;
  revisionId: string | null;
  documentType: string | null;
}

export const createModalStateAtom = atom<CreateModalState>({
  name: '',
  projectId: null,
  subprojectId: null,
  revisionId: null,
  documentType: null
});

// Reset modal state atom
export const resetModalStateAtom = atom(
  null,
  (_, set) => {
    set(createModalOpenAtom, false);
    set(deleteModalOpenAtom, null);
    set(selectedFileAtom, null);
    set(createModalStateAtom, {
      name: '',
      projectId: null,
      subprojectId: null,
      revisionId: null,
      documentType: null
    });
  }
); 