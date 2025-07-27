import { atom } from 'jotai';
import type { File } from '../../types/file';

// UI state atoms (modals, selected file)
export const createDiffModalOpenAtom = atom<boolean>(false);
export const deleteModalOpenAtom = atom<File | null>(null);

// Filter state for UI (for main table filtering) - same as files
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

// Diff creation modal state (for selecting two files to compare)
export interface CreateDiffModalState {
  name: string;
  projectId: string | null;
  subprojectId: string | null;
  revisionId: string | null;
  documentType: string | null;
  firstFileId: string | null;
  secondFileId: string | null;
}

export const createDiffModalStateAtom = atom<CreateDiffModalState>({
  name: '',
  projectId: null,
  subprojectId: null,
  revisionId: null,
  documentType: null,
  firstFileId: null,
  secondFileId: null
});

// Reset modal state atom
export const resetModalStateAtom = atom(
  null,
  (_, set) => {
    set(createDiffModalOpenAtom, false);
    set(deleteModalOpenAtom, null);
    set(createDiffModalStateAtom, {
      name: '',
      projectId: null,
      subprojectId: null,
      revisionId: null,
      documentType: null,
      firstFileId: null,
      secondFileId: null
    });
  }
); 
