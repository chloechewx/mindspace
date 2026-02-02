import { create } from 'zustand';

type AuthMode = 'login' | 'signup';

interface AuthModalState {
  isOpen: boolean;
  mode: AuthMode;
  actionDescription: string;
  pendingAction: (() => void) | null;

  openModal: (mode?: AuthMode, description?: string, action?: () => void) => void;
  closeModal: () => void;
  setMode: (mode: AuthMode) => void;
  completeAction: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set, get) => ({
  isOpen: false,
  mode: 'login',
  actionDescription: '',
  pendingAction: null,

  openModal: (mode = 'login', description = '', action) => {
    set({
      isOpen: true,
      mode,
      actionDescription: description,
      pendingAction: action || null,
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      actionDescription: '',
      pendingAction: null,
    });
  },

  setMode: (mode) => {
    set({ mode });
  },

  completeAction: () => {
    const { pendingAction } = get();
    if (pendingAction) {
      pendingAction();
    }
    set({
      isOpen: false,
      actionDescription: '',
      pendingAction: null,
    });
  },
}));
